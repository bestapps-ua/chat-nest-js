import { Injectable } from '@nestjs/common';
import { Dto } from '../../dto/dto';
import { ChatRoomEntity } from '../../../chat/chat-room/entities/chat-room.entity';
import { ResponseOptionsInterface } from '../../interfaces/response-options.interface';
import { ChatRoomUserEntity } from '../../../chat/chat-room-user/entities/chat-room-user.entity';
import { ChatMessage } from '../../../chat/chat-message/shemas/chat-message.scheme';
import { ChatMessageController } from '../../../chat/chat-message/controllers/chat-message.controller';

@Injectable()
export class ResponseService {
    private readonly name: string = 'ResponseServiceInstance';

    async getResponse(data: Dto, options: ResponseOptionsInterface) {
        delete data['id'];
        return data;
    }

    async getChatRoomResponse(data: ChatRoomEntity, options: any) {
        return {
            uid: data.uid,
            name: data.name,
            updated: data.updated,
            created: data.created,
        };
    }

    async getChatMessageResponse(data: ChatMessage, options: any) {
        return {
            uid: data.uid,
            encryptedContent: data.encryptedContent,
            //@ts-ignore
            updated: Math.round(new Date(data.updatedAt).getTime() / 1000),
            //@ts-ignore
            created: Math.round(new Date(data.createdAt).getTime() / 1000),
        };
    }

    public async _methodNotFound(
        methodName: string,
        args: any[],
    ): Promise<any> {
        if (methodName.includes('Response')) {
            return await this.getResponse(args[0], args[1]);
        }

        console.warn(
            `[ResponseService] Method "${methodName}" not found. Arguments:`,
            args,
        );
        return Promise.reject(
            new Error(
                `Method "${methodName}" does not exist on ResponseService.`,
            ),
        );
    }

    public createProxiedInstance(): ResponseService {
        const handler: ProxyHandler<ResponseService> = {
            get: (
                target: ResponseService,
                prop: string | symbol,
                receiver: any,
            ) => {
                const propertyName = String(prop);
                if (
                    [
                        'then',
                        'catch',
                        'finally',
                        'onModuleInit',
                        'onApplicationBootstrap',
                    ].includes(propertyName)
                ) {
                    if (
                        typeof target[propertyName as keyof ResponseService] ===
                        'function'
                    ) {
                        return Reflect.get(target, prop, receiver);
                    }
                    return undefined;
                }

                // 2. If the property exists AND it's a function (an existing method)
                if (
                    typeof target[propertyName as keyof ResponseService] ===
                        'function' &&
                    propertyName !== '_methodNotFound' // Ensure _methodNotFound isn't accidentally proxied as a missing method
                ) {
                    return function (...args: any[]) {
                        return Reflect.apply(
                            target[
                                propertyName as keyof ResponseService
                            ] as Function,
                            receiver,
                            args,
                        );
                    };
                } else if (
                    propertyName in target &&
                    typeof target[propertyName as keyof ResponseService] !==
                        'function'
                ) {
                    return target[propertyName as keyof ResponseService];
                } else {
                    return function (...args: any[]) {
                        return Reflect.apply(target._methodNotFound, receiver, [
                            propertyName,
                            args,
                        ]);
                    };
                }
            },
        };

        return new Proxy(this, handler) as ResponseService;
    }
}
