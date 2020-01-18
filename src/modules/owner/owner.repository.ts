import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { OwnerEntity } from './owner.entity';

@EntityRepository(OwnerEntity)
export class OwnerRepository extends Repository<OwnerEntity> {}
