import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({ timestamps: true, collection: 'chat_message' })
export class ChatMessage {
    @Prop({ type: String, required: true, index: true, unique: true })
    uid: string;

    @Prop({ type: String, required: true, index: true })
    ownerId: string;

    @Prop({ type: String, required: true, index: true })
    roomId: string;

    @Prop({ required: true, type: String })
    encryptedContent: string;

    @Prop([
        {
            userId: { type: String, required: true },
            key: { type: String, required: true },
        },
    ])
    encryptedSymmetricKeys: {
        userId: string;
        key: string;
    }[];

    @Prop({ type: String, enum: ['text', 'image', 'multi', 'system'], default: 'text' })
    type: string;

    @Prop({ type: String, enum: ['active', 'deleted'], default: 'active' })
    status: string;

    @Prop([
        {
            fileId: { type: String, required: true },
            encryptedFilename: { type: String },
            encryptedFileMetadata: { type: String },
        },
    ])
    attachments?: {
        fileId: string;
        encryptedFilename?: string;
        encryptedFileMetadata?: string;
    }[];

    @Prop({ type: Boolean, default: false })
    isRead: boolean = false;

    @Prop({ type: [String] })
    readBy: string[] = [];

    @Prop([
        {
            userId: { type: String, required: true },
            reaction: { type: String, required: true },
        },
    ])
    reactions?: { userId: String; reaction: string }[];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
