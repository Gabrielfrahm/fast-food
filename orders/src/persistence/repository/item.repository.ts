import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, left, right } from 'src/shared/either';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';

@Injectable()
export class ItemRepository {
  private readonly model: PrismaService['item'];

  async create(item: ItemEntity): Promise<Either<Error, ItemEntity>> {
    try {
      const checkItemAlreadyExist = await this.model.findFirst({
        where: {
          name: item.getName(),
        },
      });
      if (checkItemAlreadyExist) {
        left(new Error('Item Already existing'));
      }

      await this.model.create({
        data: {
          id: item.getId(),
          name: item.getName(),
          price: item.getPrice(),
          createdAt: item.getCreatedAt(),
          updatedAt: item.getUpdatedAt(),
        },
      });

      return right(item);
    } catch (e) {
      return left(e);
    }
  }
}
