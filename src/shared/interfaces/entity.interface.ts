import { UidVO } from '../vo/uid.vo';
import { NumberVO } from '../vo/number.vo';

export interface EntityInterface {
  uid: UidVO;
  updated: NumberVO;
  created: NumberVO;
}
