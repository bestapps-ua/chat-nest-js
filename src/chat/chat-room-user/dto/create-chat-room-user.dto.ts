import { CreateDto } from '../../../shared/dto/dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatRoomUserDto extends CreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  room: string;

  @IsString()
  @ApiPropertyOptional()
  status: string;
}
