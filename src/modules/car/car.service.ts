import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { FindConditions } from 'typeorm';

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

  async updateCar(carUpdate: CarUpdateDto, carId: string): Promise<CarEntity> {
    const car = await this.carRepository.findOne(carId);
    if (!car) {
      throw new NotFoundException();
    }

    await this._updateRepository(carUpdate, carId);

    return this.carRepository.findOne({
      where: { id: carId },
      relations: ['manufacturer', 'owners'],
    });
  }

  private async _updateRepository(carUpdate: CarUpdateDto, carId: string) {
    if (carUpdate.manufacturerId) {
      const manufacturer = await this._manufacturerService.findOne({
        id: carUpdate.manufacturerId,
      });
      if (!manufacturer) {
        throw new RelationNotFoundException();
      }
      return this.carRepository.update(carId, {
        manufacturer,
        ...omit(carUpdate, ['manufacturerId']),
      });
    }
    return this.carRepository.update(carId, carUpdate);
  }

  async deleteCar(carId: string): Promise<void> {
    const { affected } = await this.carRepository.delete(carId);
    if (!affected) {
      throw new NotFoundException();
    }
    return;
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
    const car = await this.carRepository.findOne(carId, {
      relations: ['manufacturer'],
      select: ['id', 'manufacturer'],
    });
    if (!car) {
      throw new NotFoundException();
    }
    return car.manufacturer;
  }
}
