import { ApiModelProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { ManufacturerDto } from './ManufacturerDto';

export class ManufacturersPageDto {
    @ApiModelProperty({
        type: ManufacturerDto,
        isArray: true,
    })
    readonly data: ManufacturerDto[];

    @ApiModelProperty()
    readonly meta: PageMetaDto;

    constructor(data: ManufacturerDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
