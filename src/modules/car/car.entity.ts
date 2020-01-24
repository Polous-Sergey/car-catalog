import { ApiModelProperty } from '@nestjs/swagger';
import { ceil } from 'lodash';
import * as moment from 'moment';
import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PriceTransformer } from '../../common/value-transformers/price.transformer';
import { ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { OwnerEntity } from '../owner/owner.entity';

@Entity({ name: 'cars' })
export class CarEntity extends AbstractEntity {
  @ApiModelProperty()
  @Column({ transformer: new PriceTransformer() })
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
  @AfterInsert()
  after() {
    const diff = moment().diff(moment(this.firstRegistrationDate), 'month');
    if (diff >= 12 && diff <= 18) {
      return (this.price = ceil(this.price * 0.8, 2));
    }
  }
}
