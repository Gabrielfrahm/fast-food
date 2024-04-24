import { Body, Controller, Post } from '@nestjs/common';
import { CreateItemDto } from '../dto/request/item/createItem.dto';
import { ItemService } from 'src/core/application/services/item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  // @HttpCode(HttpStatus.CREATED)
  async createItem(@Body() data: CreateItemDto) {
    const response = await this.itemService.create(data);
    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }
}
