import { ApiModelProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { OwnerEntity } from '../owner.entity';

export class OwnersPageDto {
  @ApiModelProperty({
    type: OwnerEntity,
    isArray: true,
  })
  readonly data: OwnerEntity[];

  @ApiModelProperty()
  readonly meta: PageMetaDto;

  constructor(data: OwnerEntity[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
