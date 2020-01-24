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

import { QueryOptionsDto } from '../../common/dto/QueryOptionsDto';
import { ManufacturerCreateDto } from './dto/ManufacturerCreateDto';
import { ManufacturersPageDto } from './dto/ManufacturersPageDto';
import { ManufacturersPageOptionsDto } from './dto/ManufacturersPageOptionsDto';
import { ManufacturerUpdateDto } from './dto/ManufacturerUpdateDto';
import { ManufacturerEntity } from './manufacturer.entity';
import { ManufacturerService } from './manufacturer.service';

@Controller('manufacturer')
@ApiUseTags('manufacturer')
export class ManufacturerController {
  constructor(private _manufacturerService: ManufacturerService) {}

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
    return this._manufacturerService.getManufacturers(pageOptions);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create manufacturer',
    type: ManufacturerEntity,
  })
  createManufacturer(
    @Body(new ValidationPipe({ transform: true }))
    manufacturer: ManufacturerCreateDto,
  ): Promise<ManufacturerEntity> {
    return this._manufacturerService.createManufacturer(manufacturer);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update manufacturer',
    type: ManufacturerEntity,
  })
  updateManufacturer(
    @Body(new ValidationPipe({ transform: true }))
    manufacturer: ManufacturerUpdateDto,
    @Query(new ValidationPipe({ transform: true }))
    { id: manufacturerId }: QueryOptionsDto,
  ): Promise<ManufacturerEntity> {
    return this._manufacturerService.updateManufacturer(
      manufacturer,
      manufacturerId,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete manufacturer',
    type: {},
  })
  deleteManufacturer(
    @Query(new ValidationPipe({ transform: true }))
    { id: manufacturerId }: QueryOptionsDto,
  ): Promise<void> {
    return this._manufacturerService.deleteManufacturer(manufacturerId);
  }
}
