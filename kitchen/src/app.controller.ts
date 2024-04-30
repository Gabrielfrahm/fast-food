import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { randomInt } from 'crypto';
import { Observable, Subject, map } from 'rxjs';

@Controller()
export class AppController {
  private orders = [];
  private ordersUpdates = new Subject<any>();
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('process_order')
  async getPlayers(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(data);
    this.orders.push(data);
    this.ordersUpdates.next(this.orders);
    await channel.ack(originalMsg);
    return randomInt(10);
  }

  @Sse('orders-stream')
  ordersStream(): Observable<MessageEvent> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.ordersUpdates
      .asObservable()
      .pipe(map((data) => ({ data: { data } })));
  }
}
