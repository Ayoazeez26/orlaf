import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import cookieParser = require("cookie-parser")

import { CustomLogger } from "@sable/logger"
import { AppModule } from "./app.module"

CustomLogger.init({
  // biome-ignore lint/style/noNonNullAssertion: <>
  dsn: process.env.SENTRY_DSN!,
  environment: process.env.NODE_ENV,
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger("Bootstrap")

  // ─── Global Pipes ────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  app.use(cookieParser())

  // ─── CORS ────────────────────────────────────────────────────────────────
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["https://orlaf-creator-web.vercel.app"]

  // ─── CORS ────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  })

  // ─── Global prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix("api/v1")

  // ─── Swagger ─────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle("Sable TV API")
    .setDescription("Sable TV backend API documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste your access_token here",
      },
      "access-token"
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  logger.log(`🚀 Backend running on http://localhost:${port}/api/v1`)
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`)
}

bootstrap().catch((err) => {
  const logger = new CustomLogger("Bootstrap")
  logger.error({ event: "bootstrap_failed" }, err)
  process.exit(1)
})
