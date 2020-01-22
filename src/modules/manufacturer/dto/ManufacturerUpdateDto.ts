import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Max,
    MaxLength,
    MinLength,
} from 'class-validator';

import { Trim } from '../../../decorators/transforms.decorator';
import { IsSiret } from '../../../decorators/validators.decorator';

export class ManufacturerUpdateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Trim()
    @MinLength(2)
    @MaxLength(30)
    name: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Trim()
    @IsPhoneNumber('ZZ')
    phone: string;

    @ApiModelPropertyOptional()
    @ApiModelProperty()
    @Type(() => Number)
    @IsInt()
    @Max(9223372036854775807)
    @IsSiret({
        message: 'Invalid siret',
    })
    @IsOptional()
    siret: number;
}
