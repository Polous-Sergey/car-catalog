'use strict';

import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { OwnerEntity } from '../owner.entity';

export class OwnerDto extends AbstractDto {
    @ApiModelPropertyOptional()
    name: string;

    @ApiModelPropertyOptional()
    purchaseDate: Date;

    constructor(owner: OwnerEntity) {
        super(owner);
        this.name = owner.name;
        this.purchaseDate = owner.purchaseDate;
    }
}
