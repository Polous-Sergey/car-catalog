import { ApiModelProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { ManufacturerEntity } from '../manufacturer.entity';

export class ManufacturersPageDto {
    @ApiModelProperty({
        type: ManufacturerEntity,
        isArray: true,
    })
    readonly data: ManufacturerEntity[];

    @ApiModelProperty()
    readonly meta: PageMetaDto;

    constructor(data: ManufacturerEntity[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
