import { randomUUID } from 'crypto';
import { ItemEntity } from '../../order/item.entity';
import { OrderEntity, OrderEntityProps } from '../../order/order.entity';

describe('Order Entity teste unit', () => {
  test('should be able to create a new Order', () => {
    const items = [
      ItemEntity.createNew({
        name: 'x-tudo',
        price: 20.0,
      }),
      ItemEntity.createNew({
        name: 'duplo bacon',
        price: 18.0,
      }),
    ];

    const order = OrderEntity.createNew({
      clientName: 'Gabriel',
      items: items,
    });

    expect(order.getId()).toBeDefined();
    expect(order.getClient()).toBe('Gabriel');
    expect(order.getItems()).toHaveLength(2);
    expect(order.getPrice()).toBeDefined();
    expect(order.getPrice()).toBe(38.0);

    order.addItem([
      ItemEntity.createNew({
        name: 'salad',
        price: 12.59,
      }),
    ]);

    expect(order.getItems()).toHaveLength(3);
    expect(order.getPrice()).toBe(50.59);
  });

  test('should be able create order entity by parameters', () => {
    const id = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const items = [
      ItemEntity.createNew({
        name: 'x-tudo',
        price: 20.0,
      }),
      ItemEntity.createNew({
        name: 'duplo bacon',
        price: 18.0,
      }),
    ];

    const parameters: OrderEntityProps = {
      id,
      clientName: 'Gabriel',
      items,
      createdAt,
      updatedAt,
      deletedAt: null,
      price: items.reduce((acc, item) => acc + item.getPrice(), 0),
    };

    const order = OrderEntity.createFrom({ ...parameters });

    expect(order.getId()).toBeDefined();
    expect(order.getClient()).toBe('Gabriel');
    expect(order.getItems()).toHaveLength(2);
    expect(order.getPrice()).toBeDefined();
    expect(order.getPrice()).toBe(38.0);

    order.addItem([
      ItemEntity.createNew({
        name: 'salad',
        price: 12.59,
      }),
    ]);

    expect(order.getItems()).toHaveLength(3);
    expect(order.getPrice()).toBe(50.59);
  });
});
