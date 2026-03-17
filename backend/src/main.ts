import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // ← отключаем глобально, AdminJS использует свой парсер
  });
  await app.listen(4000, '0.0.0.0');
}
bootstrap().catch(console.error);
