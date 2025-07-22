import { EntityType } from '../types/entity-type.type';

import { EntityVO } from '../vo/entity.vo';
import { EntityInterface } from '../interfaces/entity.interface';

export class EntityCreatedEvent<T extends EntityInterface> {
    constructor(public readonly type: EntityType, public readonly entity: EntityVO<T>) {}
}
