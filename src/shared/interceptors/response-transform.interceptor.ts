import {
    CallHandler,
    ExecutionContext, Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto } from '../dto/dto';
import { RESPONSE_SERVICE } from '../contants/response.constants';
import { ResponseService } from '../services/response/response.service';
import { ResponseOptionsInterface } from '../interfaces/response-options.interface';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    constructor(
        @Inject(RESPONSE_SERVICE)
        private readonly responseService: ResponseService,
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Dto> {
        const controllerClass = context.getClass();
        const handlerMethod = context.getHandler();
        const controllerParent = Object.getPrototypeOf(controllerClass).name;
        const request = context.switchToHttp().getRequest();
        const name = controllerClass.name.replace('Controller', '');

        const method = `get${name}Response`;
        return next.handle().pipe(
            map(async (data: Dto[]) => {
                if(controllerParent !== 'CrudController') {
                    return data;
                }

                const options: ResponseOptionsInterface = {
                    query: request.query,
                    name,
                    method: handlerMethod.name,
                }

                if (Array.isArray(data)) {
                    let p: Promise<any>[] = [];
                    for (const item of data) {
                        p.push(new Promise(async (resolve: any, reject: any) => {
                            const d = await (this.responseService as any)[method](data, options);
                            resolve(d);
                        }));
                    }
                    return await Promise.all(p);
                }

                return await (this.responseService as any)[method](data, options);
            }),
        );
    }
}
