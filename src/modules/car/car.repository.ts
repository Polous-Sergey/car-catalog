import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CarEntity } from './car.entity';

@EntityRepository(CarEntity)
export class CarRepository extends Repository<CarEntity> {}
