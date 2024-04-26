import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateItemDto,
  CreateItemDtoResponse,
} from '../dto/item/createItem.dto';
import { ItemService } from 'src/core/application/services/item.service';
import { RestResponseInterceptor } from '../interceptor/rest-response.interceptor';
import { FindByIdItemDto } from '../dto/item/findByIdItem.dto';
import { ListItemDto } from '../dto/item/listItem.dto';

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

  @Get(':id')
  async findByIdItem(@Param() params: FindByIdItemDto) {
    const response = await this.itemService.findOne(params.id);

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }

  @Get()
  async list(@Query() query: ListItemDto) {
    const response = await this.itemService.list({ ...query });

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }
}
