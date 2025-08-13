import { forwardRef, Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileKey, ProfileKeySchema } from './schemas/profile-key.scheme';
import { ProfileKeyService } from './services/profile-key/profile-key.service';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        MongooseModule.forFeature([{ name: ProfileKey.name, schema: ProfileKeySchema }]),
        forwardRef(() => SharedModule),
    ],
    controllers: [ProfileController],
    providers: [ProfileService, ProfileKeyService],
    exports: [ProfileService, ProfileKeyService],
})
export class ProfileModule {}
