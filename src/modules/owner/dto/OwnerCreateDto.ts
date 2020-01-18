import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class OwnerCreateDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    @IsUUID()
    carId: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    purchaseDate: Date;
}
