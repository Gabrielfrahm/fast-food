import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersService } from './order.service';
import { ItemController } from './infra/http/rest/controller/item.controller';
import { ItemService } from './core/application/services/item.service';
import { ItemRepository } from './persistence/repository/item.repository';
import { PrismaService } from './persistence/prisma/prisma.service';

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
  controllers: [AppController, ItemController],
  providers: [
    AppService,
    OrdersService,
    ItemService,
    ItemRepository,
    PrismaService,
  ],
})
export class AppModule {}
