import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes (excluding health)
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' 
      ? true // Allow all origins in development
      : process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Load OpenAPI specification from YAML file
  const openApiPath = path.join(__dirname, '..', 'OpenAPI.yaml');
  const openApiYaml = fs.readFileSync(openApiPath, 'utf8');
  const document = yaml.load(openApiYaml) as any;
  
  // Update server URLs to match current configuration
 
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`🚀 Jobs Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap(); 