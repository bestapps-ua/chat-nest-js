import {
    Controller,
    Get,
    Inject,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProfileService } from '../services/profile/profile.service';
import { UserVO } from '../../user/vo/user.vo';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { TransformResponse } from '../../shared/decorators/transform-response.decorator';

@Controller({
    path: 'profile',
})
@ApiBearerAuth()
@TransformResponse(true)
export class ProfileController {
    @Inject(ProfileService) service: ProfileService;

    @Get()
    @UseGuards(AuthGuard)
    async findOne(@Req() request: Request) {
        let user: UserVO = request['user'];
        return this.service.get(user.getUid().value);
    }
}
