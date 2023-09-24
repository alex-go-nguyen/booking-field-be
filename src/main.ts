import * as fs from 'fs';
import * as https from 'https';
import { Logger, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import * as io from 'socket.io';
import { AppModule } from './app.module';

dotenv.config();

const logger = new Logger('Bootstrap');

const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  forbidUnknownValues: true,
};

export class ExtendedSocketIoAdapter extends IoAdapter {
  protected ioServer: io.Server;

  constructor(protected server: https.Server) {
    super();

    const options = {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };

    this.ioServer = new io.Server(server, options);
  }

  create(_: number) {
    console.log(
      'websocket gateway port argument is ignored by ExtendedSocketIoAdapter, use the same port of http instead',
    );
    return this.ioServer;
  }
}

async function bootstrap() {
  let httpsOptions: HttpsOptions;

  const server = express();

  if (process.env.ENV === 'production') {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
  }

  const httpsServer = https.createServer(httpsOptions);

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: {
      origin: ['https://go2play.vercel.app'],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Authorization'],
      credentials: true,
    },
    httpsOptions,
  });

  app.useWebSocketAdapter(new ExtendedSocketIoAdapter(httpsServer));

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

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  app.setGlobalPrefix('api');

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
