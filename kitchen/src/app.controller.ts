import { Body, Controller, Get, Inject, Post, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientProxy,
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
    @Inject('KITCHEN_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async initialDate() {
    if (this.orders.length === 0) {
      const orders = await this.primaService['order'].findMany({
        include: {
          order_items: {
            include: {
              item: true,
            },
          },
        },
      });
      this.orders.push(...orders);
      this.ordersUpdates.next(this.orders);
    }
  }

  @MessagePattern('process_order')
  async getOrders(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.orders.push(data);
      this.ordersUpdates.next(this.orders);
      await channel.ack(originalMsg);
    } catch (error) {
      console.error('Erro ao processar a ordem:', error);
      await channel.nack(originalMsg, false, false);
    }
  }

  @Sse('orders-stream')
  ordersStream(): Observable<MessageEvent> {
    this.initialDate().then();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.ordersUpdates.asObservable().pipe(map((data) => ({ data })));
  }

  @Post()
  async doneOrder(@Body() data) {
    return this.client.send<any>('done_order', data);
  }

  @Get('/list')
  async index(@Res() response: Response) {
    // .send(readFileSync(join(__dirname, 'index.html')).toString());
    response.type('text/html').send(`<script type="text/javascript">
      const eventSource = new EventSource('/orders-stream');
      eventSource.onmessage = ({ data }) => {
        JSON.parse(data).forEach((item) => {
          console.log(item)
        })
        const message = document.createElement('div');
        message.innerText = data;
        document.body.appendChild(message);
      }
    </script>`);
  }
}
