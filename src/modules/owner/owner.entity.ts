import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CarEntity } from '../car/car.entity';

@Entity({ name: 'owners' })
export class OwnerEntity extends AbstractEntity {
  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;

  @ManyToOne(
    () => CarEntity,
    car => car.owners,
    {
      onDelete: 'CASCADE',
    },
  )
  public car: CarEntity;
}
