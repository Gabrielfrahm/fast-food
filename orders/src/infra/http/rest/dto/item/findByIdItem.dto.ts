import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindByIdItemDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}
