import { Injectable, Scope } from '@nestjs/common';
import { ResponseOptionsInterface } from '../../interfaces/response-options.interface';

@Injectable({ scope: Scope.REQUEST })
export class RequestDataService {
    private data: any = {};

    set(key: string, value: any) {
        this.data[key] = value;
    }

    get(key: string): any {
        return this.data[key];
    }

    getData() {
        return this.data;
    }

    setResponseOptions(data: Partial<ResponseOptionsInterface>) {
        this.set('responseOptions', data);
    }
}
