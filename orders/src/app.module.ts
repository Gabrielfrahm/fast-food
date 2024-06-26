import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ItemController } from './infra/http/rest/controller/item.controller';
import { ItemService } from './core/application/services/item.service';
import { ItemRepository } from './persistence/repository/item.repository';
import { PrismaService } from './persistence/prisma/prisma.service';
import { OrdersService } from './core/application/services/order.service';
import { OrderController } from './infra/http/rest/controller/order.controller';
import { OrderRepository } from './persistence/repository/order.repository';

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
  controllers: [AppController, ItemController, OrderController],
  providers: [
    AppService,
    OrdersService,
    ItemService,
    ItemRepository,
    OrderRepository,
    PrismaService,
  ],
})
export class AppModule {}
