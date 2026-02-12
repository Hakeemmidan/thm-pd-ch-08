import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (cachedApp) return;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.init();
  cachedApp = app;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
