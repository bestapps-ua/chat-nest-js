import { VO } from '../../shared/vo/vo';

export class PasswordVO extends VO<string> {
  public isValid(value: string): boolean {
    // Allow null/undefined passwords for cases where password isn't required
    if (value === null || value === undefined) return true;

    // If a password is provided, it should be a non-empty string
    return typeof value === 'string' && value.length > 0;
  }
}
