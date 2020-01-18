'use strict';

import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ManufacturerDto } from '../../manufacturer/dto/ManufacturerDto';
import { OwnerDto } from '../../owner/dto/OwnerDto';
import { CarEntity } from '../car.entity';

export class CarDto extends AbstractDto {
    @ApiModelPropertyOptional()
    manufacturer: ManufacturerDto;

    @ApiModelPropertyOptional()
    owners: OwnerDto[];

    @ApiModelPropertyOptional()
    price: number;

    @ApiModelPropertyOptional()
    firstRegistrationDate: Date;

    constructor(car: CarEntity) {
        super(car);
        this.manufacturer = car.manufacturer;
        this.owners = car.owners;
        this.price = car.price;
        this.firstRegistrationDate = car.firstRegistrationDate;
    }
}
