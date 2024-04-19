import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('KITCHEN_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendOrder(order: any) {
    console.log('publicado');

    return this.client.emit<any>('process_order', order);
  }
}
