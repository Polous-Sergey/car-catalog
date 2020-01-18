import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { QueryOptionsDto } from '../../common/dto/QueryOptionsDto';
import { OwnerCreateDto } from './dto/OwnerCreateDto';
import { OwnerDto } from './dto/OwnerDto';
import { OwnersPageDto } from './dto/OwnersPageDto';
import { OwnersPageOptionsDto } from './dto/OwnersPageOptionsDto';
import { OwnerUpdateDto } from './dto/OwnerUpdateDto';
import { OwnerService } from './owner.service';

@Controller('owner')
@ApiUseTags('owner')
export class OwnerController {
    constructor(private _ownerService: OwnerService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get owners list',
        type: OwnersPageDto,
    })
    getOwners(
        @Query(new ValidationPipe({ transform: true }))
        pageOptions: OwnersPageOptionsDto,
    ): Promise<OwnersPageDto> {
        return this._ownerService.getOwners(pageOptions);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create owner',
        type: OwnerCreateDto,
    })
    createOwner(
        @Body(new ValidationPipe({ transform: true }))
        owner: OwnerCreateDto,
    ): Promise<OwnerDto> {
        return this._ownerService.createOwner(owner);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update owner',
        type: OwnerUpdateDto,
    })
    updateOwner(
        @Body(new ValidationPipe({ transform: true }))
        owner: OwnerUpdateDto,
        @Query(new ValidationPipe({ transform: true }))
        { id: ownerId }: QueryOptionsDto,
    ): Promise<UpdateResult> {
        return this._ownerService.updateOwner(owner, ownerId);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update owner',
        type: QueryOptionsDto,
    })
    deleteOwner(
        @Query(new ValidationPipe({ transform: true }))
        { id: ownerId }: QueryOptionsDto,
    ): Promise<DeleteResult> {
        return this._ownerService.deleteOwner(ownerId);
    }
}
