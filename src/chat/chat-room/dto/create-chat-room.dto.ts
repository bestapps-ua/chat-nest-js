import { CreateDto, CreateEntityDto } from '../../../shared/dto/dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatRoomStatus } from '../types/chat-room-status.type';
import { ChatRoomType } from '../types/chat-room-type.type';

export class CreateChatRoomDto extends CreateEntityDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({enum: ChatRoomType})
    type: string;

    @IsNotEmpty()
    @IsString()
    status: string = ChatRoomStatus.Active;

    ownerId: number;
}
