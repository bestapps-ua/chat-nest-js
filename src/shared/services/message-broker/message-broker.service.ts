import { Injectable, Logger } from '@nestjs/common';
import {
    AmqpConnection,
    RabbitSubscribe,
    Nack,
} from '@golevelup/nestjs-rabbitmq';

import {
    MessagePattern,
    Payload,
    Ctx,
    RmqContext,
} from '@nestjs/microservices';

interface RabbitMqCustomContext {
    channel: any; // The AMQP channel object
    message: any; // The original AMQP message
}

/**
 * Docs https://github.com/golevelup/nestjs/blob/master/docs/modules/rabbitmq.md
 */
@Injectable()
export class MessageBrokerService {
    private readonly logger = new Logger(MessageBrokerService.name);

    constructor(private readonly amqpConnection: AmqpConnection) {}

    async publishTopicMessage(routingKey: string, data: any) {
        try {
            await this.amqpConnection.publish('my.exchange', routingKey, data);
            this.logger.log(
                `Published to 'my.exchange' with routing key '${routingKey}'`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to publish to 'my.exchange' with routing key '${routingKey}': ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    async publishFanoutMessage(data: any) {
        try {
            await this.amqpConnection.publish('fanout.exchange', '', data); // Routing key is usually empty for fanout
            this.logger.log(`Published to 'fanout.exchange' (fanout)`);
        } catch (error) {
            this.logger.error(
                `Failed to publish to 'fanout.exchange': ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    @RabbitSubscribe({
        exchange: 'my.exchange',
        routingKey: 'event.entity::created',
        queue: 'entity_created_queue',
    })
    public async pubSubHandler(
        @Payload() data: any,
        @Ctx() context: RabbitMqCustomContext,
    ) {
        const channel = context.channel;
        const originalMsg = context.message;

        try {
            console.log('Received message:', data);

            console.log('Message acknowledged');
        } catch (error) {
            console.error('Error processing message:', error);
            return new Nack(true);
        }
    }
}
