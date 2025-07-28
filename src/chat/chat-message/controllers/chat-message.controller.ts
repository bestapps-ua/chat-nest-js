import {
    Body,
    Controller,
    Inject,
    Patch,
    Post,
    Req,
    UsePipes,
} from '@nestjs/common';
import { ChatMessageService } from '../services/chat-message.service';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { UpdateChatMessageDto } from '../dto/update-chat-message.dto';
import { CrudController } from '../../../shared/controllers/crud.controller';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PrefixedUuidV7Param } from '../../../shared/decorators/parse.prefixed.uuid.decorator';
import { GenerateUuidIfEmptyPipe } from '../../../shared/pipes/generate.prefixed.uuid.pipe';
import { UserVO } from '../../../user/vo/user.vo';

@Controller({
    path: 'chat/messages',
})
@ApiBearerAuth()
export class ChatMessageController extends CrudController<
    CreateChatMessageDto,
    UpdateChatMessageDto
> {
    @Inject(ChatMessageService) declare readonly service: ChatMessageService;

    //TODO: check access by room...
    @Post()
    @ApiBody({ type: CreateChatMessageDto })
    @UsePipes(new GenerateUuidIfEmptyPipe())
    create(@Body() create: CreateChatMessageDto, @Req() request: Request) {
        const user: UserVO = request['user'];
        create.ownerId = user.getUid().value;
        return super.create(create, request);
    }

    @Patch(':uid')
    @ApiBody({ type: UpdateChatMessageDto })
    update(
        @PrefixedUuidV7Param('uid') uid: string,
        @Body() update: UpdateChatMessageDto,
    ) {
        return super.update(uid, update);
    }
}
