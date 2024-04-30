import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindByIdOrderDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}
