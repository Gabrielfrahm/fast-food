import { randomUUID } from 'crypto';
import { BaseEntity, BaseEntityProps } from '../base.entity';

export interface ItemEntityProps extends BaseEntityProps {
  name: string;
  price: number;
}

export class ItemEntity extends BaseEntity {
  private name: ItemEntityProps['name'];
  private price: ItemEntityProps['price'];

  private constructor(data: ItemEntityProps) {
    super(data);
  }

  static createNew(
    data: Omit<ItemEntityProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
    id = randomUUID(),
  ): ItemEntity {
    return new ItemEntity({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: ItemEntityProps): ItemEntity {
    return new ItemEntity({
      id: data.id,
      name: data.name,
      price: data.price,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }
}
