import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Either, left, right } from 'src/shared/either';
import { OrderEntity } from 'src/core/domain/entity/order/order.entity';
import { List } from 'src/shared/list';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';

import { ApplicationException } from 'src/core/domain/exception/application.exception';

@Injectable()
export class OrderRepository {
  private readonly model: PrismaService['order'];

  constructor(prismaService: PrismaService) {
    this.model = prismaService.order;
  }

  async create(data: OrderEntity): Promise<Either<Error, OrderEntity>> {
    try {
      await this.model.create({
        data: {
          id: data.getId(),
          clientName: data.getClient(),
          price: data.getPrice(),
          done: data.getDone(),
          OrderItems: {
            createMany: {
              data: data.getItems().map((item) => ({
                itemId: item.getId(),
              })),
            },
          },
          createdAt: data.getCreatedAt(),
          updatedAt: data.getUpdatedAt(),
        },
      });

      return right(data);
    } catch (e) {
      return left(e);
    }
  }

  async list({
    page = 1,
    perPage = 10,
    clientName,
    price,
    createdAt,
    item,
    done,
  }): Promise<Either<Error, List<OrderEntity>>> {
    const skip = (page - 1) * perPage;
    const take = perPage;
    try {
      const orders = await this.model.findMany({
        where: {
          deletedAt: null,
          ...(clientName && {
            clientName: {
              contains: clientName,
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
          ...(item && {
            OrderItems: {
              some: {
                item: {
                  name: {
                    contains: item,
                    mode: 'insensitive',
                  },
                },
              },
            },
          }),
          ...(done && {
            done: {
              equals: done,
            },
          }),
        },
        include: {
          OrderItems: {
            include: {
              item: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      });

      const count = await this.model.count({
        where: {
          deletedAt: null,
          ...(clientName && {
            clientName: {
              contains: clientName,
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
          ...(item && {
            OrderItems: {
              some: {
                item: {
                  name: {
                    contains: item,
                    mode: 'insensitive',
                  },
                },
              },
            },
          }),
          ...(done && {
            done: {
              equals: done,
            },
          }),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const lastPage = Math.ceil(count / take);

      return right({
        data: orders.map((order) =>
          OrderEntity.createFrom({
            id: order.id,
            clientName: order.clientName,
            price: order.price,
            items: order.OrderItems.map((orderItem) =>
              ItemEntity.createFrom(orderItem.item),
            ),
            done: order.done,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            deletedAt: order.deletedAt,
          }),
        ),
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

  async findById(id: string): Promise<Either<Error, OrderEntity>> {
    try {
      const order = await this.model.findUnique({
        where: {
          id,
        },
        include: {
          OrderItems: {
            include: { item: true },
          },
        },
      });

      if (!order) {
        return left(new ApplicationException('order not found', 404));
      }

      return right(
        OrderEntity.createFrom({
          id: order.id,
          clientName: order.clientName,
          price: order.price,
          items: order.OrderItems.map((orderItem) =>
            ItemEntity.createFrom(orderItem.item),
          ),
          done: order.done,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          deletedAt: order.deletedAt,
        }),
      );
    } catch (e) {
      return left(e);
    }
  }
}
