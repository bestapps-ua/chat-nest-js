import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto } from '../dto/dto';
import { RESPONSE_SERVICE } from '../contants/response.constants';
import { ResponseService } from '../services/response/response.service';
import { ResponseOptionsInterface } from '../interfaces/response-options.interface';
import { TRANSFORM_RESPONSE_KEY } from '../decorators/transform-response.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    constructor(
        @Inject(RESPONSE_SERVICE)
        private readonly responseService: ResponseService,
        private readonly reflector: Reflector,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<Dto> {
        const controllerClass = context.getClass();
        const handlerMethod = context.getHandler();
        const controllerParent = Object.getPrototypeOf(controllerClass).name;
        const request = context.switchToHttp().getRequest();
        const name = controllerClass.name.replace('Controller', '');



        const transformOnClass = this.reflector.get<boolean>(
            TRANSFORM_RESPONSE_KEY,
            controllerClass,
        );

        const transformOnMethod = this.reflector.get<boolean>(
            TRANSFORM_RESPONSE_KEY,
            handlerMethod,
        );

        return next.handle().pipe(
            map(async (data: Dto[]) => {
                if (
                    controllerParent !== 'CrudController' && !transformOnClass && !transformOnMethod
                ) {
                    return data;
                }

                let method = `get${name}`;
                if(Array.isArray(data)) {
                    if(!method.endsWith('s')){
                        method += 's';
                    }
                }
                method += 'Response';

                const options: ResponseOptionsInterface = {
                    query: request.query,
                    name,
                    method: handlerMethod.name,
                    request,
                };

                return await (this.responseService as any)[method](
                    data,
                    options,
                );
            }),
        );
    }
}
