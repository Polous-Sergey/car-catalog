import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
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

export class OwnerCreateDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiModelProperty()
  @IsUUID()
  carId: string;

  @ApiModelPropertyOptional()
  @IsDateString()
  @IsOptional()
  purchaseDate: string;
}
