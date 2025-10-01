import { Inject, Injectable } from '@nestjs/common';
import { CallingOptions, ServiceBroker } from 'moleculer';
import { MOLECULER_BROKER } from '../../constants/moleculer.constants';


@Injectable()
export class BrokerService {
  @Inject(MOLECULER_BROKER) private readonly broker: ServiceBroker;

  async call<T, P>(action: string, data?: P, options?: CallingOptions): Promise<T> {
    try {
      const result = await this.broker.call(action, data, options);
      return result as T;
    } catch (error) {
      console.log('err call', {error, action, data});
      throw error;
    }
  }
}
