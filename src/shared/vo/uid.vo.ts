import { VO } from '../../shared/vo/vo';

export class UidVO extends VO<string> {
  public isValid(value: string): boolean {
    if (!value) return false;

    // Basic UID validation - non-empty string
    return value.trim().length > 0;
  }
}
