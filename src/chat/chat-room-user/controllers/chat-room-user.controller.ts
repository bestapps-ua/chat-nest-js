import { Body, Controller, Inject, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { ChatRoomUserService } from '../services/chat-room-user.service';
import { CrudController } from '../../../shared/controllers/crud.controller';
import { CreateChatRoomUserDto } from '../dto/create-chat-room-user.dto';
import { UpdateChatRoomUserDto } from '../dto/update-chat-room-user.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PrefixedUuidV7Param } from '../../../shared/decorators/parse.prefixed.uuid.decorator';
import { GenerateUuidIfEmptyPipe } from '../../../shared/pipes/generate.prefixed.uuid.pipe';

@Controller({
  path: 'chat/room-users',
})
@ApiBearerAuth()
export class ChatRoomUserController extends CrudController<
  CreateChatRoomUserDto,
  UpdateChatRoomUserDto
> {
  @Inject(ChatRoomUserService) declare readonly service: ChatRoomUserService;

  @Post()
  @ApiBody({ type: CreateChatRoomUserDto })
  @UsePipes(new GenerateUuidIfEmptyPipe())
  create(@Body() create: CreateChatRoomUserDto, @Req() request: Request) {
    return super.create(create, request);
  }

  @Patch(':uid')
  @ApiBody({ type: UpdateChatRoomUserDto })
  update(
    @PrefixedUuidV7Param('uid') uid: string,
    @Body() update: UpdateChatRoomUserDto,
  ) {
    return super.update(uid, update);
  }
}
