import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsArray()
  @IsNotEmpty()
  items: string[];
}
