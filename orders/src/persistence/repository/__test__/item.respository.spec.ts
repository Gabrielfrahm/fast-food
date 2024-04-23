import { ItemEntity } from 'src/core/domain/entity/order/item.entity';
import { ItemRepository } from '../item.repository';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';

describe('item repository test', () => {
  let module: TestingModule;
  let app: INestApplication;
  let repository: ItemRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, ItemRepository],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    repository = module.get<ItemRepository>(ItemRepository);
  });

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2024-01-01'));
  });

  afterEach(async () => {
    await repository.clear();
  });

  it('should throw if already existing item', async () => {
    let item = ItemEntity.createNew({
      name: 'pizza',
      price: 20.01,
    });
    let result = await repository.create(item);
    expect(result.isRight()).toBeTruthy();

    item = ItemEntity.createNew({
      name: 'pizza',
      price: 20.01,
    });
    result = await repository.create(item);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value['message']).toBe('Item Already existing');
  });

  it('should create Item', async () => {
    const item = ItemEntity.createNew({
      name: 'pizza',
      price: 20.01,
    });
    const result = await repository.create(item);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ItemEntity);
    expect(result.value['id']).toBeDefined();
    expect(result.value['name']).toBe('pizza');
    expect(result.value['price']).toBe(20.01);
  });
});
