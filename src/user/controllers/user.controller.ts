import { Body, Controller, Inject, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CrudController } from '../../shared/controllers/crud.controller';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { PrefixedUuidV7Param } from '../../shared/decorators/parse.prefixed.uuid.decorator';
import { GenerateUuidIfEmptyPipe } from '../../shared/pipes/generate.prefixed.uuid.pipe';

@Controller({
  path: 'users',
})
export class UserController extends CrudController<
  CreateUserDto,
  UpdateUserDto
> {
  @Inject(UserService) declare readonly service: UserService;

  @Post()
  @ApiBody({ type: CreateUserDto })
  @UsePipes(new GenerateUuidIfEmptyPipe())
  @UseGuards(AuthGuard)
  create(@Body() create: CreateUserDto, @Req() request: Request) {
    return super.create(create, request);
  }

  @Patch(':uid')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AuthGuard)
  update(
    @PrefixedUuidV7Param('uid') uid: string,
    @Body() update: UpdateUserDto,
  ) {
    //TODO: check for uniq
    return super.update(uid, update);
  }
}
