import { VO } from './vo';
import { StringOptionsVoInterface } from '../interfaces/string-options-vo.interface';

export class NumberVO extends VO<number> {
    public isValid(value: number): boolean {
        if (!value && value !== null) return false;
        return true;
    }
}
