import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from 'src/core/application/services/order.service';
import { CreateOrderDto } from '../dto/order/createOrder.dto';
import { ListOrderDto } from '../dto/order/listOrder.dto';
import { FindByIdOrderDto } from '../dto/order/findByIdOrder.dto';

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
}
