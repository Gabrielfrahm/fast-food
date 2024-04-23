import { Injectable } from '@nestjs/common';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { ItemRepository } from 'src/persistence/repository/item.repository';
import { Either, left, right } from 'src/shared/either';

export interface ItemCreateCommand {
  name: string;
  price: number;
}

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async create(
    itemData: ItemCreateCommand,
  ): Promise<Either<Error, ItemEntity>> {
    const item = ItemEntity.createNew(itemData);
    const itemSaved = await this.itemRepository.create(item);
    if (itemSaved.isLeft()) {
      return left(itemSaved.value);
    }
    return right(itemSaved.value);
  }
}
