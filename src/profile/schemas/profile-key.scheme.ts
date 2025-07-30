import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProfileKeyDocument = HydratedDocument<ProfileKey>;

@Schema({ timestamps: true, collection: 'profile_key' })
export class ProfileKey {
    @Prop({ type: String, required: true, index: true, unique: true })
    uid: string;

    @Prop({ type: String, required: true, index: true, unique: true })
    userId: string;

    @Prop({ type: String, required: true })
    publicKey: string;
}

export const ProfileKeySchema = SchemaFactory.createForClass(ProfileKey);
