import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import {
    AfterLoad,
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { OwnerEntity } from '../owner/owner.entity';

@Entity({ name: 'cars' })
export class CarEntity extends AbstractEntity {
    @ApiModelProperty()
    @Column()
    price: number;

    @ApiModelProperty()
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    firstRegistrationDate: Date;

    @ApiModelProperty({
        type: ManufacturerEntity,
    })
    @ManyToOne(
        () => ManufacturerEntity,
        manufacturer => manufacturer.cars,
        {
            onDelete: 'CASCADE',
        },
    )
    public manufacturer: ManufacturerEntity;

    @ApiModelProperty({
        type: OwnerEntity,
        isArray: true,
    })
    @OneToMany(
        () => OwnerEntity,
        owner => owner.car,
    )
    public owners: OwnerEntity[];

    @AfterLoad()
    afterLoad() {
        const diff = moment().diff(moment(this.firstRegistrationDate), 'month');
        if (diff >= 12 && diff <= 18) {
            return (this.price = Math.round(this.price * 0.8) / 100);
        }
        this.price = this.price / 100;
    }

    @BeforeInsert()
    beforeInsert() {
        this.price = Math.round(this.price * 100);
    }
}
