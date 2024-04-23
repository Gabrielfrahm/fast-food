import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from '../item.service';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { ItemRepository } from 'src/persistence/repository/item.repository';
import { INestApplication } from '@nestjs/common';
import { ItemEntity } from 'src/core/domain/entity/order/item.entity';

describe('item service test', () => {
  let itemService: ItemService;
  let module: TestingModule;
  let app: INestApplication;
  let repository: ItemRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, ItemRepository, ItemService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    itemService = module.get<ItemService>(ItemService);
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

  it('should create a item', async () => {
    const item = await itemService.create({
      name: 'test',
      price: 20.05,
    });

    expect(item.isRight()).toBeTruthy();
    expect(item.value).toBeInstanceOf(ItemEntity);
    expect(item.value['name']).toBe('test');
    expect(item.value['price']).toBe(20.05);
  });

  it('should return left value if item already existing', async () => {
    let item = await itemService.create({
      name: 'test',
      price: 20.05,
    });

    expect(item.isRight()).toBeTruthy();

    item = await itemService.create({
      name: 'test',
      price: 20.05,
    });

    expect(item.isLeft()).toBeTruthy();
  });
});
