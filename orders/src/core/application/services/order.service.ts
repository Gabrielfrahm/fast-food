import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { OrderEntity } from 'src/core/domain/entity/order/order.entity';
import { ItemRepository } from 'src/persistence/repository/item.repository';
import { OrderRepository } from 'src/persistence/repository/order.repository';
import { Either, left, right } from 'src/shared/either';
import { List } from 'src/shared/list';

export interface OrderCreateCommand {
  clientName: string;
  items: string[];
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject('KITCHEN_SERVICE') private readonly client: ClientProxy,
    private readonly orderRepository: OrderRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async create(data: OrderCreateCommand): Promise<Either<Error, OrderEntity>> {
    const items: ItemEntity[] = [];

    for (const item of data.items) {
      const itemRepo = await this.itemRepository.findById(item);
      if (itemRepo.isLeft()) {
        return left(itemRepo.value);
      }
      items.push(itemRepo.value);
    }

    const orderEntity = OrderEntity.createNew({
      clientName: data.clientName,
      items: items,
    });
    const orderSaved = await this.orderRepository.create(orderEntity);

    if (orderSaved.isLeft()) {
      return left(orderSaved.value);
    }
    await this.sendOrder(orderSaved.value);
    return right(orderSaved.value);
  }

  async list(params: {
    page?: number;
    perPage?: number;
    clientName?: string;
    price?: number;
    createdAt?: Date;
    item?: string;
    done?: boolean;
  }): Promise<Either<Error, List<OrderEntity>>> {
    const repoResponse = await this.orderRepository.list({
      page: params.page,
      perPage: params.perPage,
      clientName: params.clientName,
      price: params.price,
      createdAt: params.createdAt,
      item: params.item,
      done: params.done,
    });

    if (repoResponse.isLeft()) {
      return left(repoResponse.value);
    }

    return right(repoResponse.value);
  }

  async findByIdOrder(id: string): Promise<Either<Error, OrderEntity>> {
    const repoResponse = await this.orderRepository.findById(id);

    if (repoResponse.isLeft()) {
      return left(repoResponse.value);
    }

    return right(repoResponse.value);
  }

  async done(order: OrderEntity): Promise<Either<Error, boolean>> {
    const repoResponse = await this.orderRepository.done(order);

    if (repoResponse.isLeft()) {
      return left(repoResponse.value);
    }

    return right(repoResponse.value);
  }

  async sendOrder(order: OrderEntity) {
    console.log('publicado');
    return this.client.emit<OrderEntity>('process_order', order);
  }
}
