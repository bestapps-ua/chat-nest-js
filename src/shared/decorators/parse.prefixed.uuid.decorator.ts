import {
  ArgumentMetadata,
  BadRequestException, createParamDecorator, ExecutionContext,
  Injectable,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { UidService } from '../services/uid/uid.service';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';


export const PrefixedUuidV7Param = createParamDecorator(
  (param: string|object, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const controller = ctx.getClass();

    let prefix = UidService.getPrefixByController(controller);
    let paramName = param;
    if(typeof param !== 'string') {
        paramName = param['paramName'];
        prefix = param['prefix'] ?? prefix;
    }
    console.log(param);
    const paramValue = request.params[paramName as string];

    if (!paramValue) {
      throw new BadRequestException(`Param "${paramName}" not found`);
    }

    if (!paramValue.startsWith(prefix)) {
      throw new BadRequestException(`Param does not start with required prefix "${prefix}"`);
    }

    const uuidPart = paramValue.slice(prefix.length + 1);
    if (!uuidValidate(uuidPart) || uuidVersion(uuidPart) !== 7) {
      throw new BadRequestException('Param is not a valid UUID version 7');
    }

    return paramValue;
  },
);
