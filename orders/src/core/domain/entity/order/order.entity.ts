import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from '../base.entity';
import { ItemEntity } from './item.entity';

export interface OrderEntityProps extends BaseEntityProps {
  items: ItemEntity[];
  price?: number;
  clientName: string;
  done?: boolean;
}

export class OrderEntity extends BaseEntity {
  private items: OrderEntityProps['items'];
  private price: OrderEntityProps['price'];
  private clientName: OrderEntityProps['clientName'];
  private done: OrderEntityProps['done'];

  private constructor(data: OrderEntityProps) {
    super(data);
    if (data.items) {
      this.price = data.items.reduce((acc, item) => acc + item.getPrice(), 0);
    }
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
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static createFrom(data: OrderEntityProps): OrderEntity {
    return new OrderEntity({
      id: data.id,
      clientName: data.clientName,
      items: data.items,
      price: data.price,
      done: data.done,
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
      done: this.done,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  addItem([...item]: ItemEntity[]): void {
    this.items.push(...item);
    this.price = this.items.reduce((acc, item) => acc + item.getPrice(), 0);
  }

  getItems(): ItemEntity[] {
    return this.items;
  }

  getPrice(): number {
    return this.price;
  }

  getClient(): string {
    return this.clientName;
  }

  getDone(): boolean {
    return this.done;
  }

  Done(): void {
    this.done = true;
  }
}
