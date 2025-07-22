import { CreateDto } from '../../../shared/dto/dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatRoomMessageStatus } from '../types/chat-room-message-status.type';
import { ChatRoomMessageType } from '../types/chat-room-message-type.type';

export class CreateChatMessageDto extends CreateDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    roomUid: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    message: string;

    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional()
    type: string = ChatRoomMessageType.Text;

    @IsString()
    @ApiPropertyOptional()
    status: string = ChatRoomMessageStatus.Active;

    ownerId: string;
}
