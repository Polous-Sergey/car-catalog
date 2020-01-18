'use strict';

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
import { ManufacturerCreateDto } from './dto/ManufacturerCreateDto';
import { ManufacturerDto } from './dto/ManufacturerDto';
import { ManufacturersPageDto } from './dto/ManufacturersPageDto';
import { ManufacturersPageOptionsDto } from './dto/ManufacturersPageOptionsDto';
import { ManufacturerUpdateDto } from './dto/ManufacturerUpdateDto';
import { ManufacturerService } from './manufacturer.service';

@Controller('manufacturer')
@ApiUseTags('manufacturer')
export class ManufacturerController {
    constructor(private manufacturerService: ManufacturerService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get manufacturers list',
        type: ManufacturersPageDto,
    })
    getManufacturers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptions: ManufacturersPageOptionsDto,
    ): Promise<ManufacturersPageDto> {
        return this.manufacturerService.getManufacturers(pageOptions);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create manufacturer',
        type: ManufacturerCreateDto,
    })
    createManufacturer(
        @Body(new ValidationPipe({ transform: true }))
        manufacturer: ManufacturerCreateDto,
    ): Promise<ManufacturerDto> {
        return this.manufacturerService.createManufacturer(manufacturer);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update manufacturer',
        type: ManufacturerUpdateDto,
    })
    updateManufacturer(
        @Body(new ValidationPipe({ transform: true }))
        manufacturer: ManufacturerUpdateDto,
        @Query(new ValidationPipe({ transform: true }))
        { id: manufacturerId }: QueryOptionsDto,
    ): Promise<UpdateResult> {
        return this.manufacturerService.updateManufacturer(
            manufacturer,
            manufacturerId,
        );
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update manufacturer',
        type: QueryOptionsDto,
    })
    deleteManufacturer(
        @Query(new ValidationPipe({ transform: true }))
        { id: manufacturerId }: QueryOptionsDto,
    ): Promise<DeleteResult> {
        return this.manufacturerService.deleteManufacturer(manufacturerId);
    }
}
