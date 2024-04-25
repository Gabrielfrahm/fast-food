import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { CustomValidationPipe } from 'src/class-validation.pipe';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { EitherExceptionFilter } from 'src/error-handler';
import { ItemRepository } from 'src/persistence/repository/item.repository';
import * as request from 'supertest';

describe('item controller (e2e)', () => {
  let module: TestingModule;
  let app: INestApplication;
  let itemRepository: ItemRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());

    const httpAdapterHost = app.get(HttpAdapterHost);

    app.useGlobalFilters(new EitherExceptionFilter(httpAdapterHost));
    await app.init();

    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2024-01-01'));
  });

  afterEach(async () => {
    await itemRepository.clear();
  });

  describe('/items (POST)', () => {
    it('create a new item', async () => {
      const item = {
        name: 'pizza',
        price: 21.99,
      };

      await request(app.getHttpServer())
        .post('/items')
        .send({
          ...item,
        })
        .expect((response) => {
          expect(response.body).toMatchObject({
            name: item.name,
            price: item.price,
          });
        });
    });

    it('throw erro if item already existing', async () => {
      const item = {
        name: 'pizza',
        price: 21.99,
      };
      await itemRepository.create(ItemEntity.createNew(item));
      await request(app.getHttpServer())
        .post('/items')
        .send({
          ...item,
        })
        .expect((response) => {
          expect(response.body).toMatchObject({
            statusCode: 403,
            message: 'item already existing',
          });
        });
    });

    it('throw validator erro', async () => {
      await request(app.getHttpServer())
        .post('/items')
        .send({
          name: 'pizza',
        })
        .expect((response) => {
          expect(response.body).toMatchObject({
            message: [{ property: 'price' }],
          });
        });
    });
  });
});
