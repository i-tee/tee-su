import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Image } from './image.entity';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class S3UploadService {
  private readonly logger = new Logger(S3UploadService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly uploadsDir: string;

  constructor(
    @InjectRepository(Image)
    private readonly repo: Repository<Image>,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get<string>('S3_BUCKET', '');
    this.publicUrl = this.config.get<string>('S3_PUBLIC_URL', '');
    this.uploadsDir = join(__dirname, '..', '..', 'uploads');

    this.s3Client = new S3Client({
      endpoint: this.config.get<string>('S3_ENDPOINT'),
      region: this.config.get<string>('S3_REGION', 'ru1'),
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY', ''),
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY', ''),
      },
      forcePathStyle: true,
    });
  }

  /**
   * Главная точка входа. Вызывается после успешной загрузки файла в локальное хранилище.
   * Если флаг saveToS3 установлен — запускает полный цикл загрузки в S3.
   */
  async handlePostUpload(imageId: number): Promise<void> {
    this.logger.log(`[S3] handlePostUpload вызван для image #${imageId}`);

    const image = await this.repo.findOne({ where: { id: imageId } });

    if (!image) {
      this.logger.warn(`[S3] Image #${imageId} не найдена в БД, пропуск`);
      return;
    }

    if (!image.saveToS3) {
      this.logger.log(
        `[S3] Флаг saveToS3 не установлен для image #${imageId}, пропуск`,
      );
      return;
    }

    if (!image.url) {
      this.logger.warn(
        `[S3] Image #${imageId} не имеет URL (файл не загружен?), пропуск`,
      );
      return;
    }

    if (image.url.startsWith('http')) {
      this.logger.log(
        `[S3] Image #${imageId} уже имеет внешний URL (${image.url}), пропуск`,
      );
      return;
    }

    const localFilePath = join(this.uploadsDir, image.url);
    const s3Key = image.url;

    this.logger.log(
      `[S3] Начинаем загрузку: локальный путь = ${localFilePath}, S3 ключ = ${s3Key}`,
    );

    // Шаг 1: читаем файл
    const fileContent = await this.readLocalFile(localFilePath);

    // Шаг 2: загружаем в S3
    await this.uploadFileToS3(
      fileContent,
      s3Key,
      image.mimeType || 'application/octet-stream',
    );

    // Шаг 3: получаем публичный URL
    const s3Url = this.getS3PublicUrl(s3Key);
    this.logger.log(`[S3] Публичный URL в S3: ${s3Url}`);

    // Шаг 4: обновляем запись в БД
    await this.updateImageRecord(imageId, s3Url);

    // Шаг 5: удаляем локальный файл
    await this.removeLocalFile(localFilePath);

    this.logger.log(`[S3] Готово. Image #${imageId} успешно перемещена в S3`);
  }

  // ─── Шаг 1 ───────────────────────────────────────────────────────────────────

  private async readLocalFile(filePath: string): Promise<Buffer> {
    this.logger.log(`[S3] Шаг 1: читаем локальный файл ${filePath}`);
    const content = await fs.readFile(filePath);
    this.logger.log(
      `[S3] Шаг 1: файл прочитан, размер = ${content.length} байт`,
    );
    return content;
  }

  // ─── Шаг 2 ───────────────────────────────────────────────────────────────────

  private async uploadFileToS3(
    fileContent: Buffer,
    s3Key: string,
    mimeType: string,
  ): Promise<void> {
    this.logger.log(
      `[S3] Шаг 2: загружаем в S3 bucket="${this.bucket}", key="${s3Key}", mimeType="${mimeType}"`,
    );

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      Body: fileContent,
      ContentType: mimeType,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);
    this.logger.log(`[S3] Шаг 2: файл успешно загружен в S3`);
  }

  // ─── Шаг 3 ───────────────────────────────────────────────────────────────────

  private getS3PublicUrl(s3Key: string): string {
    this.logger.log(`[S3] Шаг 3: формируем публичный URL для ключа "${s3Key}"`);
    return `${this.publicUrl}/${s3Key}`;
  }

  // ─── Шаг 4 ───────────────────────────────────────────────────────────────────

  private async updateImageRecord(
    imageId: number,
    s3Url: string,
  ): Promise<void> {
    this.logger.log(
      `[S3] Шаг 4: обновляем URL в БД для image #${imageId} → ${s3Url}`,
    );
    await this.repo.update(imageId, { url: s3Url });
    this.logger.log(`[S3] Шаг 4: URL в БД обновлён`);
  }

  // ─── Шаг 5 ───────────────────────────────────────────────────────────────────

  private async removeLocalFile(filePath: string): Promise<void> {
    this.logger.log(`[S3] Шаг 5: удаляем локальный файл ${filePath}`);
    await fs.unlink(filePath);
    this.logger.log(`[S3] Шаг 5: локальный файл удалён`);
  }
}

