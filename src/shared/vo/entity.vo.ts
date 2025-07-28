import { VO } from './vo';
import { EntityInterface } from '../interfaces/entity.interface';
import { UidVO } from './uid.vo';
import { NumberVO } from './number.vo';

export class EntityVO<TEntity extends EntityInterface> extends VO<TEntity> {
    getUid(): UidVO {
        return this.value.uid;
    }

    getUpdated(): NumberVO {
        return this.value.updated;
    }

    getCreated(): NumberVO {
        return this.value.created;
    }
}
