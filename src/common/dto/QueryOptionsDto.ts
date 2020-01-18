import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class QueryOptionsDto {
    @ApiModelPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    readonly id: string;
}
