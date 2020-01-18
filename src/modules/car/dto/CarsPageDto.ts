import { ApiModelProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { CarEntity } from '../car.entity';

export class CarsPageDto {
    @ApiModelProperty({
        type: CarEntity,
        isArray: true,
    })
    readonly data: CarEntity[];

    @ApiModelProperty()
    readonly meta: PageMetaDto;

    constructor(data: CarEntity[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
