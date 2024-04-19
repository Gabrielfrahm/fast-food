import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from '../base.entity';
import { ItemEntity } from './item.entity';

export interface OrderEntityProps extends BaseEntityProps {
  items: ItemEntity[];
  price: number;
  clientName: string;
}

export class OrderEntity extends BaseEntity {
  private items: OrderEntityProps['items'];
  private price: OrderEntityProps['price'];
  private clientName: OrderEntityProps['clientName'];

  private constructor(data: OrderEntityProps) {
    super(data);
  }

  static createNew(
    data: Omit<
      OrderEntityProps,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id = randomUUID(),
  ): OrderEntity {
    return new OrderEntity({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: OrderEntityProps): OrderEntity {
    return new OrderEntity({
      id: data.id,
      clientName: data.clientName,
      items: data.items,
      price: data.price,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      client_name: this.clientName,
      items: this.items.map((item) => item.serialize()),
      price: this.price,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
