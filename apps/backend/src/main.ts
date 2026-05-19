import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ─── Global Pipes ────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       
      forbidNonWhitelisted: true,
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── CORS ────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: [
    ],
    credentials: true,
  });

  // ─── Global prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Backend running on http://localhost:${port}/api/v1`);
}

bootstrap();