'use strict';

import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OwnerCreateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    carId: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    purchaseDate: Date;
}
