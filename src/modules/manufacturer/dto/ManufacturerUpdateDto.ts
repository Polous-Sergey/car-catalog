import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

import { Trim } from '../../../decorators/transforms.decorator';

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
    @MinLength(4)
    @MaxLength(15)
    phone: string;

    @ApiModelPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsOptional()
    siret: number;
}
