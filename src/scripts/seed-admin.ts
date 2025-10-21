// src/scripts/seed-admin.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    await authService.createAdmin('admin', 'admin123');
    console.log('Admin user created: username: admin, password: admin123');
  } catch (error) {
    console.log('Admin user already exists or error:', error.message);
  }

  await app.close();
}

bootstrap();