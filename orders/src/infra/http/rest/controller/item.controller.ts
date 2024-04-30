import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { DeleteByIdItemDto } from '../dto/item/deleteItem.dto';
import { UpdateItemDto } from '../dto/item/updateItem.dto';

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

  @Delete(':id')
  async delete(@Param() params: DeleteByIdItemDto) {
    const response = await this.itemService.delete(params.id);

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Omit<UpdateItemDto, 'id'>,
  ) {
    const response = await this.itemService.update({
      id,
      ...data,
    });

    if (response.isLeft()) {
      throw response.value;
    }

    return response.value;
  }
}
