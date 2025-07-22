import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
} from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class GenerateUuidIfEmptyPipe implements PipeTransform {
    constructor(private prefix?: any) {}

     extract(name: string) {
        let result = name.replace(/Create/g, '');
        //result = result.replace(/Update/g, '');
        result = result.replace(/Dto/g, '');
        return result;
    }

    transform(value: any, metadata: ArgumentMetadata) {

        if (
            metadata.type === 'body' &&
            typeof value === 'object' &&
            value !== null
        ) {

            if (
                (!value['uid'] || value['uid'] === '')
            ) {

                if(!this.prefix) {
                    const name = this.extract(value.constructor.name);
                    this.prefix = name[0].toLowerCase() + name.substring(1);
                }

                return {
                    ...value,
                    ['uid']: this.prefix + '.' + uuidv7(),
                };
            }
        }
        return value;
    }
}
