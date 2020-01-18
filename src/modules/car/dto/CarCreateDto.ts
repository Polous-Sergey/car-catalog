'use strict';

import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CarCreateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    manufacturerId: string;

    @ApiModelPropertyOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    firstRegistrationDate: Date;
}
