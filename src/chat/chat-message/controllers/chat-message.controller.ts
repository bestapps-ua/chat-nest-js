import {
    Body,
    Controller,
    Get,
    Inject,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { ChatMessageService } from '../services/chat-message.service';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { UpdateChatMessageDto } from '../dto/update-chat-message.dto';
import { CrudController } from '../../../shared/controllers/crud.controller';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PrefixedUuidV7Param } from '../../../shared/decorators/parse.prefixed.uuid.decorator';
import { GenerateUuidIfEmptyPipe } from '../../../shared/pipes/generate.prefixed.uuid.pipe';
import { UserVO } from '../../../user/vo/user.vo';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { ChatRoomService } from '../../chat-room/services/chat-room.service';
import { RoomVO } from '../../chat-room/vo/room.vo';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { ChatParticipantGuard } from '../../chat-room/guards/chatParticipant.guard';

@Controller({
    path: 'chat/messages',
})
@ApiBearerAuth()
export class ChatMessageController extends CrudController<
    CreateChatMessageDto,
    UpdateChatMessageDto
> {
    @Inject(ChatMessageService) declare readonly service: ChatMessageService;

    @Post()
    @UseGuards(ChatParticipantGuard)
    @ApiBody({ type: CreateChatMessageDto })
    @UsePipes(new GenerateUuidIfEmptyPipe())
    create(@Body() create: CreateChatMessageDto, @Req() request: Request) {
        const user: UserVO = request['user'];
        create.ownerId = user.getUid().value;
        return super.create(create, request);
    }

    @UseGuards(ChatParticipantGuard)
    @Patch(':uid')
    @ApiBody({ type: UpdateChatMessageDto })
    update(
        @PrefixedUuidV7Param('uid') uid: string,
        @Body() update: UpdateChatMessageDto,
    ) {
        return super.update(uid, update);
    }

    @UseGuards(ChatParticipantGuard)
    @Get('room/:uid')
    @ApiParam({ name: 'uid' })
    async allByRoom(
        @PrefixedUuidV7Param({ paramName: 'uid', prefix: 'chatRoom' }) uid: string,
        @Req() request: Request,
        @Query('limit') limit?: number,
        @Query('cursor') cursor?: string,
    ): Promise<ObjectLiteral> {
        const chatRoom: RoomVO = request['chatRoom'];

        let data = await this.service.findByChatRoom(chatRoom.getUid().value, limit, cursor);
        console.log(data);
        return data;
    }
}
