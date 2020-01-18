'use strict';

import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ManufacturerCreateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiModelPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    siret: number;
}
