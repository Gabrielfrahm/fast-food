import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListItemDto {
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

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
