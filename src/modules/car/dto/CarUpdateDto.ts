import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
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
  @Max(21474836)
  @IsOptional()
  price: number;

  @ApiModelPropertyOptional()
  @IsDateString()
  @IsOptional()
  firstRegistrationDate: string;
}
