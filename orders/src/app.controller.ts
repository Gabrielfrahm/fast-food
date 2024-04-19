import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { OrdersService } from './order.service';
import { randomInt } from 'crypto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private ordersService: OrdersService,
    @Inject('KITCHEN_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/order')
  async createOrder() {
    await this.ordersService.sendOrder({ ordem: 123, item: randomInt(10) });
    return { message: 'Order sent successfully!' };
  }

  @Get('/test')
  getAlgo(): Observable<any> {
    return this.client.send<any>('process_order', { item: randomInt(10) });
  }
}
