import { Injectable } from '@nestjs/common';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { ItemRepository } from 'src/persistence/repository/item.repository';
import { Either, left, right } from 'src/shared/either';
import { List } from 'src/shared/list';

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

  async findOne(id: string): Promise<Either<Error, ItemEntity>> {
    const item = await this.itemRepository.findById(id);

    if (item.isLeft()) {
      return left(item.value);
    }

    return right(item.value);
  }

  async list(params: {
    page?: number;
    perPage?: number;
    name?: string;
    price?: number;
    createdAt?: Date;
  }): Promise<Either<Error, List<ItemEntity>>> {
    const repoResponse = await this.itemRepository.list({
      page: params.page,
      perPage: params.perPage,
      name: params.name,
      price: params.price,
      createdAt: params.createdAt,
    });

    if (repoResponse.isLeft()) {
      return left(repoResponse.value);
    }

    return right(repoResponse.value);
  }
}
