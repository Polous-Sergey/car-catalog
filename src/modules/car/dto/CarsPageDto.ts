import { ApiModelProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { CarDto } from './CarDto';

export class CarsPageDto {
    @ApiModelProperty({
        type: CarDto,
        isArray: true,
    })
    readonly data: CarDto[];

    @ApiModelProperty()
    readonly meta: PageMetaDto;

    constructor(data: CarDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
