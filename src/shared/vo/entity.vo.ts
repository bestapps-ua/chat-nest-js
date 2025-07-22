import { VO } from './vo';
import { EntityInterface } from '../interfaces/entity.interface';
import { UidVO } from './uid.vo';

export class EntityVO <TEntity extends EntityInterface> extends VO<TEntity> {
  getUid(): UidVO {
    return this.value.uid;
  }
}