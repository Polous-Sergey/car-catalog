import { Injectable } from '@nestjs/common';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { CarEntity } from './car.entity';
import { CarRepository } from './car.repository';
import { CarCreateDto } from './dto/CarCreateDto';
import { CarsPageDto } from './dto/CarsPageDto';
import { CarsPageOptionsDto } from './dto/CarsPageOptionsDto';
import { CarUpdateDto } from './dto/CarUpdateDto';

@Injectable()
export class CarService {
    constructor(public readonly carRepository: CarRepository) {}

    findOne(findData: FindConditions<CarEntity>): Promise<CarEntity> {
        return this.carRepository.findOne(findData);
    }

    async createCar(createCar: CarCreateDto): Promise<CarEntity> {
        const car = this.carRepository.create(createCar);
        return this.carRepository.save(car);
    }

    async updateCar(
        carUpdate: CarUpdateDto,
        carId: string,
    ): Promise<UpdateResult> {
        return this.carRepository.update(carId, carUpdate);
    }

    async deleteCar(carId: string): Promise<DeleteResult> {
        return this.carRepository.delete(carId);
    }

    async getCars(pageOptions: CarsPageOptionsDto): Promise<CarsPageDto> {
        const queryBuilder = this.carRepository.createQueryBuilder('car');
        const [cars, carsCount] = await queryBuilder
            .skip(pageOptions.skip)
            .take(pageOptions.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto: pageOptions,
            itemCount: carsCount,
        });
        return new CarsPageDto(cars, pageMetaDto);
    }
}
