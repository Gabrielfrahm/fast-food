import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteByIdItemDto {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}
