import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CarEntity } from '../car/car.entity';

@Entity({ name: 'owners' })
export class OwnerEntity extends AbstractEntity {
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    purchaseDate: Date;

    @ManyToOne(
        () => CarEntity,
        car => car.owners,
    )
    public car: CarEntity;
}
