import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from 'src/core/application/services/order.service';
import { CreateOrderDto } from '../dto/order/createOrder.dto';
import { ListOrderDto } from '../dto/order/listOrder.dto';
import { FindByIdOrderDto } from '../dto/order/findByIdOrder.dto';
import {
  Ctx,
  // EventPattern,
  MessagePattern,
  // MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InfraException } from 'src/core/domain/exception/infra.exception';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrdersService) {}

  @Post('')
  async create(@Body() data: CreateOrderDto) {
    const response = await this.orderService.create(data);

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }

  @Get()
  async list(@Query() query: ListOrderDto) {
    const response = await this.orderService.list({ ...query });

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }

  @Get(':id')
  async findById(@Param() param: FindByIdOrderDto) {
    const response = await this.orderService.findByIdOrder(param.id);

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }

  @MessagePattern('done_order')
  async doneOrders(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (data.orderId) {
        const order = await this.orderService.findByIdOrder(data.orderId);

        if (order.isLeft()) {
          throw order.value;
        }
        if (order.value.getDone()) {
          throw new InfraException('order already done', 400);
        }

        await this.orderService.done(order.value);
      }
      await channel.ack(originalMsg);
      return { status: 'success', message: 'Order processed successfully' };
    } catch (error) {
      console.error('Erro ao processar a ordem:', error);
      await channel.nack(originalMsg, false, false);
      return error.message;
    }
  }
}
