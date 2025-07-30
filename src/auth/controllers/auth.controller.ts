import {
    Body,
    Controller,
    Inject,
    Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth/auth.service';
import { Public } from '../../shared/decorators/public.decorator';
import { TransformResponse } from '../../shared/decorators/transform-response.decorator';
import { UserVO } from '../../user/vo/user.vo';

@Controller({
    path: 'auth',
})
@TransformResponse(true)
export class AuthController {
    @Inject(AuthService) authService: AuthService;

    @Public()
    @Post('sign-in')
    @ApiBody({ type: SignInDto })
    @TransformResponse(true)
    async signIn(@Body() data: SignInDto): Promise<{ accessToken: string, user: UserVO }> {
        return await this.authService.signIn(data.email, data.password);
    }

    @Public()
    @Post('sign-up')
    @ApiBody({ type: SignUpDto })
    async signUp(@Body() data: SignUpDto): Promise<{ accessToken: string, user: UserVO }> {
        //TODO: process key
        return await this.authService.signUp(
            data.email,
            data.username,
            data.publicKey,
            data.password,
        );
    }
}
