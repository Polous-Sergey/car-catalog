import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CarEntity } from '../car/car.entity';

@Entity({ name: 'manufacturers' })
export class ManufacturerEntity extends AbstractEntity {
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
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
