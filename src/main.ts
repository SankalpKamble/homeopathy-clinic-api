import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppLogger } from 'src/app/common';
import "dotenv/config";

const logger = new AppLogger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application started on port ${port}`);
}
bootstrap();
