import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './middlewares/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3021

  const config = new DocumentBuilder()
    .setTitle('Metrics API')
    .setDescription('Documentação de rotas do Metrics')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  //app.use(logger);
  await app.listen(port);
  console.log(`[METRICS] Server running on port ${port}`);
}
bootstrap();
