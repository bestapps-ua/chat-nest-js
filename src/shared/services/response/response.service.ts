import { Inject, Injectable } from '@nestjs/common';
import { Dto } from '../../dto/dto';
import { ChatRoomEntity } from '../../../chat/chat-room/entities/chat-room.entity';
import { ResponseOptionsInterface } from '../../interfaces/response-options.interface';
import { ChatMessage } from '../../../chat/chat-message/shemas/chat-message.scheme';
import { UserEntity } from '../../../user/entities/user.entity';
import { UserService } from '../../../user/services/user/user.service';
import { UserVO } from '../../../user/vo/user.vo';

@Injectable()
export class ResponseService {
    private readonly name: string = 'ResponseServiceInstance';
    @Inject(UserService) userService: UserService;

    async getResponse(data: Dto, options: ResponseOptionsInterface) {
        delete data['id'];
        return data;
    }

    async getChatRoom(data: ChatRoomEntity, options: ResponseOptionsInterface) {
        return {
            uid: data.uid,
            name: data.name,
            updated: data.updated,
            created: data.created,
        };
    }

    async getChatRoomResponse(
        data: ChatRoomEntity[],
        options: ResponseOptionsInterface,
    ) {
        let items: any = [];
        for (const d of data) {
            items.push(await this.getChatRoom(d, options));
        }
        return items;
    }

    async getChatMessageResponse(
        data: ChatMessage,
        options: ResponseOptionsInterface,
    ) {
        return {
            uid: data.uid,
            encryptedContent: data.encryptedContent,
            //@ts-ignore
            updated: Math.round(new Date(data.updatedAt).getTime() / 1000),
            //@ts-ignore
            created: Math.round(new Date(data.createdAt).getTime() / 1000),
        };
    }

    async getProfile(
        data: UserEntity | UserVO,
        options: ResponseOptionsInterface,
    ) {
        const vo: UserVO =
            data instanceof UserVO
                ? data
                : ((await this.userService.getVO(data.uid)) as UserVO);
        return {
            uid: vo.getUid().value,
            email: vo.getEmail().value,
            updated: vo.getUpdated().value,
            created: vo.getCreated().value,
        };
    }

    async getProfileResponse(
        data: UserEntity,
        options: ResponseOptionsInterface,
    ) {
        return await this.getProfile(data, options);
    }

    async getAuthResponse(
        data: { accessToken: string; user: UserVO },
        options: ResponseOptionsInterface,
    ) {
        return {
            accessToken: data.accessToken,
            user: await this.getProfile(data.user, options),
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
                if (
                    typeof target[propertyName as keyof ResponseService] ===
                        'function' &&
                    propertyName !== '_methodNotFound'
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
