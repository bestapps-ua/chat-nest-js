import {
    Body,
    Controller,
    Inject,
    Patch,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common';
import { ChatRoomService } from '../services/chat-room.service';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { CrudController } from '../../../shared/controllers/crud.controller';
import { UpdateChatRoomDto } from '../dto/update-chat-room.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GenerateUuidIfEmptyPipe } from '../../../shared/pipes/generate.prefixed.uuid.pipe';
import { PrefixedUuidV7Param } from '../../../shared/decorators/parse.prefixed.uuid.decorator';
import { UserVO } from '../../../user/vo/user.vo';

@Controller({
    path: 'chat/rooms',
})
@ApiBearerAuth()
export class ChatRoomController extends CrudController<
    CreateChatRoomDto,
    UpdateChatRoomDto
> {
    @Inject(ChatRoomService) declare static readonly service: ChatRoomService;

    @Post()
    @ApiBody({ type: CreateChatRoomDto })
    @UsePipes(new GenerateUuidIfEmptyPipe())
    create(@Body() create: CreateChatRoomDto, @Req() request: Request) {
        const user: UserVO = request['user'];
        create.ownerId = user.getId();
        return super.create(create, request);
    }

    @Patch(':uid')
    @ApiBody({ type: CreateChatRoomDto })
    update(
        @PrefixedUuidV7Param('uid') uid: string,
        @Body() update: UpdateChatRoomDto,
    ) {
        return super.update(uid, update);
    }
}
