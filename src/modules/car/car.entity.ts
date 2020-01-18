import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { OwnerEntity } from '../owner/owner.entity';

@Entity({ name: 'cars' })
export class CarEntity extends AbstractEntity {
    @Column()
    price: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    firstRegistrationDate: Date;

    @ManyToOne(
        () => ManufacturerEntity,
        manufacturer => manufacturer.cars,
    )
    public manufacturer: ManufacturerEntity;

    @OneToMany(
        () => OwnerEntity,
        owner => owner.car,
        {
            onDelete: 'CASCADE',
        },
    )
    public owners: OwnerEntity[];
}
