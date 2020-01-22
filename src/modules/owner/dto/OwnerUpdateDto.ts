import { ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Trim } from '../../../decorators/transforms.decorator';

export class OwnerUpdateDto {
  @ApiModelPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiModelPropertyOptional()
  @IsUUID()
  @IsOptional()
  carId: string;

  @ApiModelPropertyOptional()
  @IsDateString()
  @IsOptional()
  purchaseDate: string;
}
