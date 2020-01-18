import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';

export class ManufacturerUpdateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone: string;

    @ApiModelPropertyOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsOptional()
    siret: number;
}
