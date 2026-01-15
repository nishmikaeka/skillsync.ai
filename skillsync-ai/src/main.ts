import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: ['chrome-extension://*'],
    credentials: true,
  });

  await app.listen(3000, '127.0.0.1');
  console.log(`Server running on http://localhost:3000`);
}

bootstrap();
