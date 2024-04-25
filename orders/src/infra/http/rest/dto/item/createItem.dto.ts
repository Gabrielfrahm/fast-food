import { Expose } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateItemDtoResponse {
  @IsUUID(4)
  @Expose()
  id: string;

  @IsString()
  @Expose()
  name: string;

  @IsNumber()
  @Expose()
  price: number;

  @IsDate()
  @Expose()
  createdAt: Date;

  @IsDate()
  @Expose()
  updatedAt: Date;
}
