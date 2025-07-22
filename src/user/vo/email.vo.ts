import { VO } from '../../shared/vo/vo';

export class EmailVO extends VO<string> {
  public isValid(value: string): boolean {
    if (!value) return false;

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
