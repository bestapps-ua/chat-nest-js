import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';

import { ChatRoomModule } from './chat/chat-room/chat-room.module';
import { ChatMessageModule } from './chat/chat-message/chat-message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import rabbitmqConfig from './config/rabbitmq.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ChatRoomUserModule } from './chat/chat-room-user/chat-room-user.module';
import { DataSource } from 'typeorm';
import { UidService } from './shared/services/uid/uid.service';
import { ServiceBroker } from 'moleculer';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

import moleculerConfig from './config/moleculer.config';
import { BrokerService } from './shared/services/broker/broker.service';
import { MOLECULER_BROKER } from './shared/contants/moleculer.constants';
import authConfig from './config/auth.config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';
import { Connection } from 'mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';
import { ResponseService } from './shared/services/response/response.service';
import { RESPONSE_SERVICE } from './shared/contants/response.constants';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                rabbitmqConfig,
                moleculerConfig,
                authConfig,
                mongoConfig,
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                entities: [__dirname + '/**/*.entity.js'],
                synchronize: false,
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('mongo.url'),
                onConnectionCreate: (connection: Connection) => {
                    connection.on('connected', () => console.log('MONGO connected'));
                    connection.on('open', () => console.log('MONGO open'));
                    connection.on('disconnected', () => console.log('MONGO disconnected'));
                    connection.on('reconnected', () => console.log('MONGO reconnected'));
                    connection.on('disconnecting', () => console.log('MONGO disconnecting'));

                    return connection;
                },
                connectionName: configService.get('mongo.name'),
            }),
            inject: [ConfigService],
        }),

        SharedModule,
        ChatRoomModule,
        ChatMessageModule,
        UserModule,
        ChatRoomUserModule,
        AuthModule,
        EventEmitterModule.forRoot(),

    ],
    controllers: [],
    providers: [
        UidService,
        {
            provide: MOLECULER_BROKER,
            useFactory: async (configService: ConfigService) => {
                const moleculerConfigData = configService.get('moleculer');

                if (!moleculerConfigData) {
                    console.error(
                        "Moleculer configuration is missing. Please check 'src/config/moleculer.config.ts' and ensure it's correctly loaded by ConfigModule under the 'moleculer' key.",
                    );
                    // Throwing an error here will prevent the application from starting with a critical misconfiguration
                    throw new Error('Moleculer configuration not found.');
                }

                const broker = new ServiceBroker({
                    nodeID: moleculerConfigData.nodeId,
                    transporter: moleculerConfigData.transporter,
                    logLevel: moleculerConfigData.logLevel || 'info',
                    metrics: moleculerConfigData.metrics || false,
                });
                await broker
                    .start()
                    .then(() => {
                        console.log('Moleculer Broker started successfully.');
                    })
                    .catch((err) => {
                        console.error('Error starting Moleculer Broker:', err);
                        throw err;
                    });

                return broker;
            },
            inject: [ConfigService],
        },
        BrokerService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
        {
            provide: RESPONSE_SERVICE,
            useFactory: (responseService: ResponseService) => {
                return responseService.createProxiedInstance();
            },
            inject: [ResponseService],
        },

    ],
    exports: [
        {
            provide: MOLECULER_BROKER,
            useExisting: MOLECULER_BROKER,
        },
        BrokerService,
        SharedModule,
    ],
})
export class AppModule implements OnModuleDestroy {
    constructor(
        private dataSource: DataSource,
        @Inject(MOLECULER_BROKER) private readonly broker: ServiceBroker,
    ) {}

    async onModuleDestroy() {
        await this.broker.stop();
    }
}
