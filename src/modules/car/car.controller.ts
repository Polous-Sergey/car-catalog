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
import { ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { CarEntity } from './car.entity';
import { CarService } from './car.service';
import { CarCreateDto } from './dto/CarCreateDto';
import { CarsPageDto } from './dto/CarsPageDto';
import { CarsPageOptionsDto } from './dto/CarsPageOptionsDto';
import { CarUpdateDto } from './dto/CarUpdateDto';

@Controller('car')
@ApiUseTags('car')
export class CarController {
  constructor(private _carService: CarService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get cars list',
    type: CarsPageDto,
  })
  getCars(
    @Query(new ValidationPipe({ transform: true }))
    pageOptions: CarsPageOptionsDto,
  ): Promise<CarsPageDto> {
    return this._carService.getCars(pageOptions);
  }

  @Get('manufacturer')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get manufacturer of car',
    type: ManufacturerEntity,
  })
  getManufacturerByCar(
    @Query(new ValidationPipe({ transform: true }))
    { id: carId }: QueryOptionsDto,
  ): Promise<ManufacturerEntity> {
    return this._carService.getManufacturerByCar(carId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create car',
    type: CarEntity,
  })
  createCar(
    @Body(new ValidationPipe({ transform: true }))
    car: CarCreateDto,
  ): Promise<CarEntity> {
    return this._carService.createCar(car);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update car',
    type: {},
  })
  updateCar(
    @Body(new ValidationPipe({ transform: true }))
    car: CarUpdateDto,
    @Query(new ValidationPipe({ transform: true }))
    { id: carId }: QueryOptionsDto,
  ): Promise<CarEntity> {
    return this._carService.updateCar(car, carId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete car',
    type: {},
  })
  deleteCar(
    @Query(new ValidationPipe({ transform: true }))
    { id: carId }: QueryOptionsDto,
  ): Promise<void> {
    return this._carService.deleteCar(carId);
  }
}
