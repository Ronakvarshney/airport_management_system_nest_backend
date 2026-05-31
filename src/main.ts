import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // it is used for extra fields check in the request if its comes it remove automatically
      transform: true, //String values ko DTO types me convert kar deta hai.
      forbidNonWhitelisted: true, // its shows error when extra fields comes
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
