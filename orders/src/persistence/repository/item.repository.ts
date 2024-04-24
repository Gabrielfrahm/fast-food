import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, left, right } from 'src/shared/either';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { Prisma } from '@prisma/client';
import { PersistenceException } from 'src/core/domain/exception/persistem.exception';

@Injectable()
export class ItemRepository {
  private readonly model: PrismaService['item'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.item;
  }

  async create(item: ItemEntity): Promise<Either<Error, ItemEntity>> {
    try {
      const checkItemAlreadyExist = await this.model.findFirst({
        where: {
          name: item.getName(),
        },
      });
      if (checkItemAlreadyExist) {
        return left(new PersistenceException('item already existing', 403));
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

  async clear(): Promise<Either<Error, Prisma.BatchPayload>> {
    try {
      return right(await this.model.deleteMany());
    } catch (error) {
      return left(error);
    }
  }
}
