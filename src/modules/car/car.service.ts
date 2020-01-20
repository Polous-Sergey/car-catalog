import { Injectable } from '@nestjs/common';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { RelationNotFoundException } from '../../exceptions/relation-not-found.exception';
import { ManufacturerEntity } from '../manufacturer/manufacturer.entity';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { CarEntity } from './car.entity';
import { CarRepository } from './car.repository';
import { CarCreateDto } from './dto/CarCreateDto';
import { CarsPageDto } from './dto/CarsPageDto';
import { CarsPageOptionsDto } from './dto/CarsPageOptionsDto';
import { CarUpdateDto } from './dto/CarUpdateDto';

@Injectable()
export class CarService {
    constructor(
        public readonly carRepository: CarRepository,
        private _manufacturerService: ManufacturerService,
    ) {}

    findOne(findData: FindConditions<CarEntity>): Promise<CarEntity> {
        return this.carRepository.findOne(findData);
    }

    async createCar(createCar: CarCreateDto): Promise<CarEntity> {
        const manufacturer = await this._manufacturerService.findOne({
            id: createCar.manufacturerId,
        });
        if (!manufacturer) {
            throw new RelationNotFoundException();
        }
        const car = this.carRepository.create({
            manufacturer,
            price: createCar.price,
            firstRegistrationDate: createCar.firstRegistrationDate,
        });
        return this.carRepository.save(car);
    }

    updateCar(carUpdate: CarUpdateDto, carId: string): Promise<UpdateResult> {
        return this.carRepository.update(carId, carUpdate);
    }

    deleteCar(carId: string): Promise<DeleteResult> {
        return this.carRepository.delete(carId);
    }

    async getCars(pageOptions: CarsPageOptionsDto): Promise<CarsPageDto> {
        const queryBuilder = this.carRepository.createQueryBuilder('car');
        const [cars, carsCount] = await queryBuilder
            .skip(pageOptions.skip)
            .take(pageOptions.take)
            .leftJoinAndSelect('car.manufacturer', 'manufacturer')
            .leftJoinAndSelect('car.owners', 'owners')
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto: pageOptions,
            itemCount: carsCount,
        });
        return new CarsPageDto(cars, pageMetaDto);
    }

    async getManufacturerByCar(carId: string): Promise<ManufacturerEntity> {
        return this.carRepository
            .findOne(carId, {
                relations: ['manufacturer'],
                select: ['id', 'manufacturer'],
            })
            .then(car => car.manufacturer);
    }
}
