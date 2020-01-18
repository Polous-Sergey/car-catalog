import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CarEntity } from '../car/car.entity';

@Entity({ name: 'manufacturers' })
export class ManufacturerEntity extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    siret: number;

    @OneToMany(
        () => CarEntity,
        car => car.manufacturer,
        {
            onDelete: 'CASCADE',
        },
    )
    public cars: CarEntity[];
}
