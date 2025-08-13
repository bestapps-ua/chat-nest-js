import { forwardRef, Global, Module } from '@nestjs/common';
import { BrokerService } from './services/broker/broker.service';
import { SessionService } from './services/session/session.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ResponseService } from './services/response/response.service';
import { OutboxEventService } from './services/outbox-event/outbox-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEventEntity } from './entities/outbox-event.entity';
import { MessageBrokerService } from './services/message-broker/message-broker.service';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserModule } from '../user/user.module';
import { RequestDataService } from './services/request-data/request-data.service';
import { ProfileModule } from '../profile/profile.module';

@Module({
    imports: [
        ConfigModule,
        forwardRef(() => UserModule),
        forwardRef(() => ProfileModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get('auth').secret,
                signOptions: {
                    expiresIn: configService.get('auth').expires || '1h',
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([OutboxEventEntity]),

        RabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const config = configService.get('rabbitmq');
                let rabbitConfig: RabbitMQConfig = {
                    exchanges: config.exchanges,
                    uri: config.uri, // Your RabbitMQ connection URL
                    connectionInitOptions: config.connectionInitOptions,
                };
                return rabbitConfig;
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [
        BrokerService,
        SessionService,
        ResponseService,
        OutboxEventService,
        MessageBrokerService,
        RequestDataService,
    ],
    exports: [
        BrokerService,
        SessionService,
        JwtModule,
        ResponseService,
        OutboxEventService,
        MessageBrokerService,
        RequestDataService,
    ],
})
export class SharedModule {}
