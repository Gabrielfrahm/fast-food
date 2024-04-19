import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Inicia o microserviço e o servidor HTTP
  await app.startAllMicroservices();
  await app.listen(3334);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
