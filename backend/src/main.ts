import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
AdminJS.registerAdapter({ Database, Resource });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  await app.listen(4000, '0.0.0.0');
}
bootstrap().catch(console.error);
