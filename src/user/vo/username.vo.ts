import { VO } from '../../shared/vo/vo';

export class UsernameVO extends VO<string> {
  public isValid(value: string): boolean {
    if (!value) return false;

    // Basic username validation - non-empty string
    return value.trim().length > 0;
  }
}
