import {
    Body,
    Controller,
    Inject,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth/auth.service';
import { Public } from '../../shared/decorators/public.decorator';
import { ChatRoomUserService } from '../../chat/chat-room-user/services/chat-room-user.service';
import { TransformResponse } from '../../shared/decorators/transform-response.decorator';

@Controller({
    path: 'auth',
})
export class AuthController {
    @Inject(AuthService) authService: AuthService;

    @Public()
    @Post('sign-in')
    @ApiBody({ type: SignInDto })
    @TransformResponse(true)
    async signIn(@Body() data: SignInDto): Promise<{ access_token: string }> {
        return await this.authService.signIn(data.email, data.password);
    }

    @Public()
    @Post('sign-up')
    @ApiBody({ type: SignUpDto })
    async signUp(@Body() data: SignUpDto): Promise<{ access_token: string }> {
        return await this.authService.signUp(
            data.email,
            data.username,
            data.password,
        );
    }
}
