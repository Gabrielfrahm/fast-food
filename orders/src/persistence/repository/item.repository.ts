import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, left, right } from 'src/shared/either';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { Prisma } from '@prisma/client';
import { PersistenceException } from 'src/core/domain/exception/persistem.exception';
import { List } from 'src/shared/list';

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

  async findById(id: string): Promise<Either<Error, ItemEntity>> {
    try {
      const item = await this.model.findUnique({
        where: {
          id,
        },
      });

      if (!item) {
        return left(new PersistenceException('item not found', 404));
      }

      return right(ItemEntity.createFrom(item));
    } catch (e) {
      return left(e);
    }
  }

  async list({
    page = 1,
    perPage = 10,
    name,
    price,
    createdAt,
  }): Promise<Either<Error, List<ItemEntity>>> {
    const skip = (page - 1) * perPage;
    const take = perPage;
    try {
      const items = await this.model.findMany({
        where: {
          ...(name && {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }),
          ...(price && {
            price: {
              equals: price,
            },
          }),
          ...(createdAt && {
            createdAt: {
              equals: createdAt,
            },
          }),
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take,
      });

      const count = await this.model.count({
        where: {
          ...(name && {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }),
          ...(price && {
            price: {
              equals: price,
            },
          }),
          ...(createdAt && {
            createdAt: {
              equals: createdAt,
            },
          }),
        },
        orderBy: {
          name: 'asc',
        },
      });

      const lastPage = Math.ceil(count / take);

      return right({
        data: items.map((item) => ItemEntity.createFrom(item)),
        meta: {
          page,
          perPage,
          total: count,
          lastPage: lastPage,
        },
      });
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
