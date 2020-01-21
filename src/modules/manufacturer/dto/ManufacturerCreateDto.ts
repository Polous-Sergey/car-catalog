import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    MaxLength,
    MinLength,
} from 'class-validator';

import { Trim } from '../../../decorators/transforms.decorator';
import { IsSiret } from '../../../decorators/validators.decorator';

export class ManufacturerCreateDto {
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    @Trim()
    @MinLength(2)
    @MaxLength(30)
    name: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    @Trim()
    @MinLength(4)
    @MaxLength(15)
    phone: string;

    @ApiModelProperty()
    @Type(() => Number)
    @IsInt()
    @Max(9223372036854775807)
    @IsSiret({
        message: 'Invalid siret',
    })
    siret: number;
}
