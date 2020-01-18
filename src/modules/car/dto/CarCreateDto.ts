import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CarCreateDto {
    @ApiModelPropertyOptional()
    @IsUUID()
    manufacturerId: string;

    @ApiModelPropertyOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstRegistrationDate: Date;
}
