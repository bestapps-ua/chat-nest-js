import {
    Body,
    Controller,
    Get,
    Inject,
    Patch,
    Post,
    Req,
    Res,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ChatRoomService } from '../services/chat-room.service';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { CrudController } from '../../../shared/controllers/crud.controller';
import { UpdateChatRoomDto } from '../dto/update-chat-room.dto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { GenerateUuidIfEmptyPipe } from '../../../shared/pipes/generate.prefixed.uuid.pipe';
import { PrefixedUuidV7Param } from '../../../shared/decorators/parse.prefixed.uuid.decorator';
import { UserVO } from '../../../user/vo/user.vo';
import { ChatRoomEntity } from '../entities/chat-room.entity';
import { ChatRoomUserService } from '../../chat-room-user/services/chat-room-user.service';
import { RequestDataService } from '../../../shared/services/request-data/request-data.service';
import { ChatRoomUserEntity } from '../../chat-room-user/entities/chat-room-user.entity';

@Controller({
    path: 'chat/rooms',
})
@ApiBearerAuth()
export class ChatRoomController extends CrudController<
    CreateChatRoomDto,
    UpdateChatRoomDto
> {
    @Inject(ChatRoomService) declare static readonly service: ChatRoomService;
    @Inject(ChatRoomUserService)
    readonly chatRoomUserService: ChatRoomUserService;
    @Inject(RequestDataService) readonly requestDataService: RequestDataService;

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

    @Get(':uid/public-keys')
    @ApiParam({ name: 'uid' })
    async publicKeys(@PrefixedUuidV7Param('uid') uid: string): Promise<ChatRoomUserEntity[]> {
        const room = (await this.service.findOneByUid(uid)) as ChatRoomEntity;
        this.requestDataService.setResponseOptions({
            method: 'getChatRoomKeys',
        });
        const users = await this.chatRoomUserService.findAllByRoom(room);
        return users || [];
    }
}
