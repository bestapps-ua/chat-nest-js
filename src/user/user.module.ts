import { Module } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ApiUserService } from './services/api/api-user/api-user.service';
import { ApiUserCredentialService } from './services/api/api-user-credential/api-user-credential.service';
import { ApiUserParamService } from './services/api/api-user-param/api-user-param.service';
import { SharedModule } from '../shared/shared.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ApiUserCredentialService,
    ApiUserParamService,
    ApiUserService,
  ],
  exports: [
    UserService,
    ApiUserCredentialService,
    ApiUserParamService,
    ApiUserService,
  ]
})
export class UserModule {}
