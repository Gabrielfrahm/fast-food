import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateItemDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
