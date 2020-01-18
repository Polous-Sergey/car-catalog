import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class QueryOptionsDto {
    @ApiModelPropertyOptional()
    @IsUUID()
    readonly id: string;
}
