import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListOrderDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  perPage?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  price?: number;

  @IsString()
  @IsOptional()
  item?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
