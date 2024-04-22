import { randomUUID } from 'crypto';
import { ItemEntity, ItemEntityProps } from '../../order/item.entity';

describe('Item entity unit test', () => {
  test('Should create new item entity', () => {
    const entity = ItemEntity.createNew({
      name: 'x-tudo',
      price: 20.0,
    });

    expect(entity.getId()).toBeDefined();
    expect(entity.getName()).toBe('x-tudo');
    expect(entity.getPrice()).toBe(20.0);
    expect(entity.getCreatedAt()).toBeDefined();
    expect(entity.getUpdatedAt()).toBeDefined();
  });

  test('Should create item entity from parameters', () => {
    const id = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const parameters: ItemEntityProps = {
      id,
      name: 'x-tudo',
      price: 20.0,
      createdAt,
      updatedAt,
      deletedAt: null,
    };

    const entity = ItemEntity.createFrom({ ...parameters });

    expect(entity.getId()).toBeDefined();
    expect(entity.getId()).toBe(id);
    expect(entity.getName()).toBe('x-tudo');
    expect(entity.getPrice()).toBe(20.0);
    expect(entity.getCreatedAt()).toBeDefined();
    expect(entity.getCreatedAt()).toBe(createdAt);
    expect(entity.getUpdatedAt()).toBeDefined();
    expect(entity.getUpdatedAt()).toBe(updatedAt);
  });
});
