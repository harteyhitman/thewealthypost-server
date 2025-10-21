import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const uploadDir = config.get('UPLOAD_DIR') || './uploads';
  app.useStaticAssets(path.join(process.cwd(), uploadDir), {
    prefix: '/uploads/', // so images served at /uploads/filename.jpg
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(config.get('PORT') || 4000);
}
bootstrap();
