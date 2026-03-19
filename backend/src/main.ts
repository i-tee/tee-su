import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
AdminJS.registerAdapter({ Database, Resource });

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Если AdminJS подставил /uploads/ перед полным S3-URL — редиректим на реальный адрес
  app.use('/uploads', (req: any, res: any, next: any) => {
    const path = req.url.replace(/^\//, '');
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return res.redirect(302, path);
    }
    next();
  });

  // Раздаём папку uploads как статику
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(4000, '0.0.0.0');
}
bootstrap().catch(console.error);
