import { Inject, Injectable } from '@nestjs/common';
import { BrokerService } from '../../../../shared/services/broker/broker.service';
import ApiUserCredentialDto from '../../../dto/api/api-user-credential.dto';
import { ApiMoleculerResponseInterface } from '../../../../shared/interfaces/api-moleculer-response.interface';

@Injectable()
export class ApiUserCredentialService {

  constructor(
    private brokerService: BrokerService
  ) {
  }

  async find(type: string, credential: any): Promise<ApiUserCredentialDto | undefined> {
    try {
      let userCredentials = await this.brokerService.call<ApiMoleculerResponseInterface[], any>("user.credential.find", {
        credentials: [{
          type,
          credential,
        }]
      });

      if (!userCredentials[0]) throw 'no data';
      return new ApiUserCredentialDto(userCredentials[0].data);
    } catch (err) {
      console.log('[err find]', type, credential, err);
    }
  }

  async getAll(uid: string) {
    let userCredentials: ApiUserCredentialDto[] = [];
    try {
      let apiUserCredentials = await this.brokerService.call<ApiMoleculerResponseInterface[], {uid: string}>("user.credential.getAll", {
        uid
      });
      for (let i = 0; i < apiUserCredentials.length; i++) {
        userCredentials.push(new ApiUserCredentialDto(apiUserCredentials[i].data));
      }
    } catch (err) {
      //console.log('[err getAll]', uid, err);
    }
    return userCredentials;
  }

  async add(uid: string, type: string, credential: string) {
    try {
      let apiUserCredential = await this.brokerService.call<ApiMoleculerResponseInterface, {uid: string, type: string, credential: string}>("user.credential.set", {
        uid,
        type,
        credential,
      });
      if (!apiUserCredential) throw 'no data';
      return new ApiUserCredentialDto(apiUserCredential.data);
    } catch (err) {
      console.log('[err add]', uid, type, credential, err);
    }
  }


  async update(uid: string, type: string, credentialPrev: string, credential: string) {
    try {
      let user = await this.brokerService.call("user.get", {
        uid,
      });
      let apiUserCredential = await this.brokerService.call<ApiMoleculerResponseInterface, {uid: string, type: string, credential: string}>("user.credential.set", {
        uid,
        type,
        credential,
      });
      if (!apiUserCredential) throw 'no data';

      await this.brokerService.call("user.credential.remove", {
        user,
        credential: credentialPrev,
        type
      });
      return  new ApiUserCredentialDto(apiUserCredential.data);
    } catch (err) {
      console.log('[err add]', uid, type, credential, err);
    }
  }
}
