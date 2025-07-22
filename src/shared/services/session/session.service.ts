import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {

  config: any;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.config = this.configService.get('auth');
  }

  sign(payload: Buffer | object) {
    return this.jwtService.sign(payload);
  }

  async verifyAsync(token: string) {
    return await this.jwtService.verifyAsync(
      token,
      {
        secret: this.config.secret
      }
    );
  }
}
