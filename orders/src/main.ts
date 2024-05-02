import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { EitherExceptionFilter } from './error-handler';
import { CustomValidationPipe } from './class-validation.pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new EitherExceptionFilter(httpAdapterHost));

  // Conecta um microserviço RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'kitchen_responses_queue',
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  // Inicia o microserviço e o servidor HTTP
  await app.startAllMicroservices();

  await app.listen(3333);
}
bootstrap();
