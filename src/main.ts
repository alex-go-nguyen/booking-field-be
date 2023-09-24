import { Logger, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import { AppModule } from './app.module';

dotenv.config();

const logger = new Logger('Bootstrap');

const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  forbidUnknownValues: true,
};

async function bootstrap() {
  const io = new Server(3003, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      logger.log(`🚀 Socket server disconnected`);
    });
    logger.log(`🚀 Socket server running on http://localhost:${3003}`);
  });

  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  Sentry.init({
    dsn: configService.get<string>('SENTRY_DNS'),
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({
        tracing: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
  });

  const config = new DocumentBuilder()
    .setTitle('Booking Football Pitches')
    .setDescription('This is APIs document for Booking football piches website')
    .setVersion('1.0')
    .addTag('Pitch')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui.html', app, document);

  app.use(cookieParser());

  app.useWebSocketAdapter(new WsAdapter(app));

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  app.setGlobalPrefix('api');

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
