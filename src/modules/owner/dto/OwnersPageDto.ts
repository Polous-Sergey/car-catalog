import { ApiModelProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { OwnerDto } from './OwnerDto';

export class OwnersPageDto {
    @ApiModelProperty({
        type: OwnerDto,
        isArray: true,
    })
    readonly data: OwnerDto[];

    @ApiModelProperty()
    readonly meta: PageMetaDto;

    constructor(data: OwnerDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
