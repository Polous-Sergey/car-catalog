'use strict';

import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';

export class CarUpdateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    manufacturerId: string;

    @ApiModelPropertyOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price: number;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstRegistrationDate: Date;
}
