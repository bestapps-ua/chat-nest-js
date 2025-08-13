import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
    Scope,
} from '@nestjs/common';
import { from, mergeMap, Observable, of, tap } from 'rxjs';
import { Dto } from '../dto/dto';
import { RESPONSE_SERVICE } from '../contants/response.constants';
import { ResponseService } from '../services/response/response.service';
import { ResponseOptionsInterface } from '../interfaces/response-options.interface';
import { TRANSFORM_RESPONSE_KEY } from '../decorators/transform-response.decorator';
import { Reflector } from '@nestjs/core';
import { RequestDataService } from '../services/request-data/request-data.service';

@Injectable({ scope: Scope.REQUEST })
export class ResponseTransformInterceptor implements NestInterceptor {
    constructor(
        @Inject(RESPONSE_SERVICE)
        private readonly responseService: ResponseService,
        private readonly reflector: Reflector,
        private readonly requestDataService: RequestDataService,
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
            mergeMap(async (data: Dto[]) => {
                if (
                    controllerParent !== 'CrudController' &&
                    !transformOnClass &&
                    !transformOnMethod
                ) {
                    return data;
                }
                const customData = this.requestDataService.getData();
                const customResponseOptions: Partial<ResponseOptionsInterface> =
                    customData.responseOptions || {};

                let method = customResponseOptions.method || `get${name}`;
                //let method = `get${name}`;
                if (Array.isArray(data)) {
                    if (!method.endsWith('s')) {
                        method += 's';
                    }
                }
                method += 'Response';

                const options: ResponseOptionsInterface = {
                    query: request.query,
                    name,
                    method: handlerMethod.name,
                    request,
                    data: {},
                };

                return await (this.responseService as any)[method](
                    data,
                    options,
                );
            }),
//            tap((d) => console.log(`After`, d)),
        );
    }
}
