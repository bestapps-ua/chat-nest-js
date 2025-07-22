import { Injectable } from '@nestjs/common';

@Injectable()
export class UidService {

  static getPrefixByController(controller: Function | object): string {
    const controllerName = typeof controller  === 'object' ? controller.constructor.name : controller.name;
    const name = controllerName.replace('Controller', '');
    return name[0].toLowerCase() + name.substring(1);
  }
}
