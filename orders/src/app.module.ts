import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersService } from './order.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KITCHEN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'order_queue',
          // noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, OrdersService],
})
export class AppModule {}
