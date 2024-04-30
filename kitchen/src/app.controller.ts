import { Controller, Get, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Response } from 'express';
import { PrismaService } from './services/prisma/prisma.service';

@Controller()
export class AppController {
  private orders = [];
  private ordersUpdates = new BehaviorSubject<any>([]);
  constructor(
    private readonly appService: AppService,
    private readonly primaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async teste() {
    if (this.orders.length === 0) {
      const orders = await this.primaService['order'].findMany();
      this.orders.push(...orders);
      this.ordersUpdates.next(this.orders);
    }
  }

  @MessagePattern('process_order')
  async getPlayers(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.orders.push(data);
    this.ordersUpdates.next(this.orders);
    await channel.ack(originalMsg);
  }

  @Sse('orders-stream')
  ordersStream(): Observable<MessageEvent> {
    this.teste().then();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.ordersUpdates.asObservable().pipe(map((data) => ({ data })));
  }

  @Get('/list')
  async index(@Res() response: Response) {
    // .send(readFileSync(join(__dirname, 'index.html')).toString());
    response.type('text/html').send(`<script type="text/javascript">
      const eventSource = new EventSource('/orders-stream');
      eventSource.onmessage = ({ data }) => {
        const message = document.createElement('div');
        message.innerText = data;
        document.body.appendChild(message);
      }
    </script>`);
  }
}
