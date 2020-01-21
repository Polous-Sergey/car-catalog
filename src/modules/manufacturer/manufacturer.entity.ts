import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CarEntity } from '../car/car.entity';

@Entity({ name: 'manufacturers' })
export class ManufacturerEntity extends AbstractEntity {
    @ApiModelProperty()
    @Column()
    name: string;

    @ApiModelProperty()
    @Column()
    phone: string;

    @ApiModelProperty()
    @Column({ type: 'bigint' })
    siret: number;

    @OneToMany(
        () => CarEntity,
        car => car.manufacturer,
    )
    public cars: CarEntity[];
}
