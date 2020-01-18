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
import { CarService } from './car.service';
import { CarCreateDto } from './dto/CarCreateDto';
import { CarDto } from './dto/CarDto';
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

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create car',
        type: CarCreateDto,
    })
    createCar(
        @Body(new ValidationPipe({ transform: true }))
        car: CarCreateDto,
    ): Promise<CarDto> {
        return this._carService.createCar(car);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update car',
        type: CarUpdateDto,
    })
    updateCar(
        @Body(new ValidationPipe({ transform: true }))
        car: CarUpdateDto,
        @Query(new ValidationPipe({ transform: true }))
        { id: carId }: QueryOptionsDto,
    ): Promise<UpdateResult> {
        return this._carService.updateCar(car, carId);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update car',
        type: QueryOptionsDto,
    })
    deleteCar(
        @Query(new ValidationPipe({ transform: true }))
        { id: carId }: QueryOptionsDto,
    ): Promise<DeleteResult> {
        return this._carService.deleteCar(carId);
    }
}
