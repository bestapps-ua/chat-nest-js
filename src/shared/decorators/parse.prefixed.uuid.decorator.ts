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
  (paramName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const controller = ctx.getClass();
    const prefix = UidService.getPrefixByController(controller);

    const paramValue = request.params[paramName];

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
