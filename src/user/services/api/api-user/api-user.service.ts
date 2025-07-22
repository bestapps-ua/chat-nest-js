import { Inject, Injectable } from '@nestjs/common';
import { BrokerService } from 'src/shared/services/broker/broker.service';

import { v7 as uuidv7 } from 'uuid';
import ApiUserDto from '../../../dto/api/api-user.dto';
import { ApiUserCredentialService } from '../api-user-credential/api-user-credential.service';
import { UserCredentialType } from '../../../types/user.credential.type';
import { ApiUserParamService } from '../api-user-param/api-user-param.service';
import { ApiMoleculerResponseInterface } from '../../../../shared/interfaces/api-moleculer-response.interface';

@Injectable()
export class ApiUserService {


  constructor(
    private brokerService: BrokerService,
    private apiUserCredentialService: ApiUserCredentialService,
    private apiUserParamService: ApiUserParamService,
  ) {

  }

  async generateUid() {
    let uid = 'user.' + uuidv7();
    let apiUser = await this.get(uid);
    if (apiUser) return this.generateUid();
    return uid;
  }

  async create(params: any = [], credentials: any = [], uid?: string) {
    try {
      let res = await this.brokerService.call<ApiMoleculerResponseInterface, {uid: string, params: any[], credentials: any}>("user.create", {
        uid: uid || await this.generateUid(),
        params,
        credentials,
      });

      let user = new ApiUserDto(Object.assign(res.data, {isNew: true}));
      return user;
    } catch (err) {
      console.log('[err create]', params, credentials, err);
    }
  }

  async get(uid: string) {
    try {
      let res = await this.brokerService.call<ApiMoleculerResponseInterface, {uid: string}>("user.get", {
        uid,
      });
      let user = new ApiUserDto(Object.assign(res.data, {isNew: false}));
      return user;
    } catch (err) {
      //console.log('[err get]', uid, err);
    }
  }

  async setPassword(uid: string, password: string) {
    try {
      let user = await this.get(uid);
      if (user) {
        await this.brokerService.call("user.setPassword", {
          user: {
            id: user.id,
            uid: user.uid,
          },
          password
        });
      }

    } catch (err) {
      console.log('[err setPassword]', uid, password, err);
    }
  }

  async getList(params) {
    try {
      return await this.brokerService.call("user.list", params);
    } catch (err) {
      console.log('[err getList]', err);
    }
  }

  async findByPhone(phone: string) {
    let userCredential = await this.apiUserCredentialService.find(UserCredentialType.Phone, phone);
    let user;
    if (!userCredential) return user;
    //console.log('[u]', userCredential);
    return await this.get(userCredential.uid);
  }

  async findByEmail(email: string) {
    let userCredential = await this.apiUserCredentialService.find(UserCredentialType.Email, email);
    if (!userCredential) return undefined;
    return await this.get(userCredential.uid);
  }

  async setPhone(uid: string, phone: string) {
    return await this.apiUserCredentialService.add(uid, UserCredentialType.Phone, phone);
  }

  async setUsername(uid: string, prevUsername: string, username: string) {
    return await this.apiUserCredentialService.update(uid, UserCredentialType.Username, prevUsername, username);
  }

  async setFirstLastName(uid: string, firstName: string, lastName: string) {
    await this.apiUserParamService.set(uid, 'firstName', firstName);
    await this.apiUserParamService.set(uid, 'lastName', lastName);
  }

  async setEmail(uid: string, prevEmail: string, email: string) {
    return await this.apiUserCredentialService.update(uid, UserCredentialType.Email, prevEmail, email);
  }

  async remove(uid: string) {
    try {
      await this.brokerService.call("user.remove", {
        uid,
      });
    } catch (err) {
      console.log('[err remove]', uid, err);
    }
  }

  async encryptPassword(password: string) {
    let encryptedPassword: string;
    try {
      encryptedPassword = await this.brokerService.call("user.encryptPassword", {
        password,
      });
    } catch (err) {
      console.log('[err encryptPassword]', password, err);
      throw err;
    }
    return encryptedPassword;
  }
}
