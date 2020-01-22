import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
} from 'class-validator';

export class CarCreateDto {
  @ApiModelProperty()
  @IsUUID()
  manufacturerId: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(21474836)
  price: number;

  @ApiModelPropertyOptional()
  @IsDateString()
  @IsOptional()
  firstRegistrationDate: string;
}
