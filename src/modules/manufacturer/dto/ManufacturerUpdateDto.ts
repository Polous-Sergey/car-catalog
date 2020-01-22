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
    @Trim()
    @MinLength(2)
    @MaxLength(30)
    @IsOptional()
    name: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @Trim()
    @IsPhoneNumber('ZZ')
    @IsOptional()
    phone: string;

    @ApiModelPropertyOptional()
    @ApiModelProperty()
    @Type(() => Number)
    @IsInt()
    @Max(99999999999999)
    @IsSiret({
        message: 'Invalid siret',
    })
    @IsOptional()
    siret: number;
}
