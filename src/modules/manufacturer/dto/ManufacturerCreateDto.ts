import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { IsSirit } from '../../../decorators/validators.decorator';

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
    @IsString()
    @IsSirit({
        message: 'Invalid siret',
    })
    siret: string;
}
