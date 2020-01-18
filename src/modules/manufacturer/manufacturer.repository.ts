import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ManufacturerEntity } from './manufacturer.entity';

@EntityRepository(ManufacturerEntity)
export class ManufacturerRepository extends Repository<ManufacturerEntity> {}
