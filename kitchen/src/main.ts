import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EitherExceptionFilter } from './error-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Conecta um microserviço RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'order_queue',
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new EitherExceptionFilter(httpAdapterHost));

  // Inicia o microserviço e o servidor HTTP
  await app.startAllMicroservices();
  await app.listen(3334);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
