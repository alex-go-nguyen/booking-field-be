import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

dotenv.config();

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Booking Field')
    .setDescription('This is APIs document for Booking Field website')
    .setVersion('1.0')
    .addTag('Field')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui.html', app, document);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({}));
  app.use;

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
