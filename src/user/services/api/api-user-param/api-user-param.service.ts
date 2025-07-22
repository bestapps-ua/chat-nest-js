import { Inject, Injectable } from '@nestjs/common';
import { BrokerService } from '../../../../shared/services/broker/broker.service';
import ApiUserParamDto from '../../../dto/api/api-user-param.dto';
import { ApiMoleculerResponseInterface } from '../../../../shared/interfaces/api-moleculer-response.interface';


@Injectable()
export class ApiUserParamService {

  constructor(
    private brokerService: BrokerService
  ) {
  }

  async getAll(uid: string){
    let userParams: ApiUserParamDto[] = [];
    try {
      let apiUserParams = await this.brokerService.call<ApiMoleculerResponseInterface[], {uid: string}>("user.param.getAll", {
        uid
      });
      for(let i = 0; i < apiUserParams.length; i++){
        userParams.push(new ApiUserParamDto(apiUserParams[i].data));
      }
    }catch (err) {
    }
    return userParams;
  }

  async set(uid: string, key: string, value: string){
    let userParam;
    try {
      let apiUserParam = await this.brokerService.call<ApiMoleculerResponseInterface, {uid: string, key: string, value: string}>("user.param.set", {
        uid,
        key,
        value,
      });
      if(!apiUserParam) throw 'no data';
      userParam = new ApiUserParamDto(apiUserParam.data);
    }catch (err) {
      console.log('[err set]', uid, key, value, err);
    }
    return userParam;
  }

  async remove(uid: string, key: string){
    try {
      let result = await this.brokerService.call("user.param.remove", {
        uid,
        key
      });
    }catch (err) {
      console.log('[err remove]', uid, key, err);
      return false;
    }
    return true;
  }

}
