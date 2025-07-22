import { VO } from './vo';
import { StringOptionsVoInterface } from '../interfaces/string-options-vo.interface';

export class StringVO extends VO<string> {
    public isValid(value: string): boolean {
        if (!value) return false;
        let options = this.options as StringOptionsVoInterface;
        if(!options.max) {
            return true;
        }
        return value.length <= options.max;
    }
}
