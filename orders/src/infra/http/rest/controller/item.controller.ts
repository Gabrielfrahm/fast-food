import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  CreateItemDto,
  CreateItemDtoResponse,
} from '../dto/item/createItem.dto';
import { ItemService } from 'src/core/application/services/item.service';
import { RestResponseInterceptor } from '../interceptor/rest-response.interceptor';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  // @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new RestResponseInterceptor(CreateItemDtoResponse))
  async createItem(@Body() data: CreateItemDto) {
    const response = await this.itemService.create(data);
    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }
}
