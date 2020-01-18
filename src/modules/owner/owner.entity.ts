import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CarEntity } from '../car/car.entity';

@Entity({ name: 'owners' })
export class OwnerEntity extends AbstractEntity {
    @Column()
    name: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    purchaseDate: Date;

    @ManyToOne(
        () => CarEntity,
        car => car.owners,
    )
    public car: CarEntity;
}
