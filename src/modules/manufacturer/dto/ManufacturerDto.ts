import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CarEntity } from '../../car/car.entity';
import { ManufacturerEntity } from '../manufacturer.entity';

export class ManufacturerDto extends AbstractDto {
    @ApiModelPropertyOptional()
    name: string;

    @ApiModelPropertyOptional()
    phone: string;

    @ApiModelPropertyOptional()
    siret: number;

    @ApiModelPropertyOptional()
    cars: CarEntity[];

    constructor(manufacturer: ManufacturerEntity) {
        super(manufacturer);
        this.name = manufacturer.name;
        this.phone = manufacturer.phone;
        this.siret = manufacturer.siret;
        this.cars = manufacturer.cars;
    }
}
