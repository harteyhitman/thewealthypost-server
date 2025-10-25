// // src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from '@nestjs/config';
// import * as path from 'path';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   // Create the app with Express platform
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   const configService = app.get(ConfigService);

//   // Global validation pipe
//   app.useGlobalPipes(new ValidationPipe());

//   // Static file serving for uploads
//   const uploadDir = configService.get('UPLOAD_DIR') || './uploads';
//   app.useStaticAssets(path.join(process.cwd(), uploadDir), {
//     prefix: '/uploads/', // Images served at /uploads/filename.jpg
//   });

//   // Swagger/OpenAPI configuration
//   const swaggerConfig = new DocumentBuilder()
//     .setTitle('Blog API')
//     .setDescription('The blog API with admin authentication')
//     .setVersion('1.0')
//     .addTag('auth')
//     .addTag('blog-posts')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//       },
//       'JWT-auth', // This name matches @ApiBearerAuth() in controllers
//     )
//     .build();

//   const document = SwaggerModule.createDocument(app, swaggerConfig);
//   SwaggerModule.setup('api', app, document, {
//     swaggerOptions: {
//       persistAuthorization: true,
//     },
//   });

//   // CORS configuration
//   app.enableCors({
//     origin: true, // or specify specific origins: ['http://localhost:3000', 'https://yourdomain.com']
//     credentials: true,
//   });

//   // Get port from config or default
//   const port = configService.get('PORT') || 4000;
  
//   await app.listen(port);
//   console.log(`Application is running on: http://localhost:${port}`);
//   console.log(`Swagger documentation available at: http://localhost:${port}/api`);
// }

// bootstrap();



import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Static file serving for uploads
  const uploadDir = configService.get('UPLOAD_DIR') || './uploads';
  app.useStaticAssets(path.join(process.cwd(), uploadDir), {
    prefix: '/uploads/',
  });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The blog API with admin authentication')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('blog-posts')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // CORS configuration - FIXED: point to frontend port 3000
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000', // Frontend runs on 3000
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = configService.get('PORT') || 4000;
  
  await app.listen(port);
  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  console.log(`📁 Static files serving from: ${uploadDir}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
}

bootstrap();