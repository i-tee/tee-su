import AdminJS, { Router as AdminRouter } from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
AdminJS.registerAdapter({ Database, Resource });

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  // Фикс: заменяем относительный путь бандла на абсолютный
  const componentsAsset = AdminRouter.assets.find(
    (a) => a.path === '/frontend/assets/components.bundle.js',
  );
  if (componentsAsset) {
    componentsAsset.src = join(process.cwd(), '.adminjs', 'bundle.js');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Если AdminJS подставил /uploads/ перед полным S3-URL — редиректим на реальный адрес
  app.use(
    '/uploads',
    (
      req: Request & { url: string },
      res: { redirect: (code: number, url: string) => void },
      next: () => void,
    ) => {
      const path = req.url.replace(/^\//, '');
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return res.redirect(302, path);
      }
      next();
    },
  );

  // Раздаём папку uploads как статику
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(4000, '0.0.0.0');
}
bootstrap().catch(console.error);
