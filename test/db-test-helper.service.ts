import { Injectable } from '@nestjs/common';

import { CarRepository } from '../src/modules/car/car.repository';
import { ManufacturerRepository } from '../src/modules/manufacturer/manufacturer.repository';
import { RelationNotFoundException } from '../src/exceptions/relation-not-found.exception';
import { OwnerEntity } from '../src/modules/owner/owner.entity';
import { OwnerCreateDto } from '../src/modules/owner/dto/OwnerCreateDto';
import { OwnerRepository } from '../src/modules/owner/owner.repository';
import { ManufacturerCreateDto } from '../src/modules/manufacturer/dto/ManufacturerCreateDto';
import { ManufacturerEntity } from '../src/modules/manufacturer/manufacturer.entity';
import { CarCreateDto } from '../src/modules/car/dto/CarCreateDto';
import { CarEntity } from '../src/modules/car/car.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class DbTestHelperService {
  constructor(
    public readonly manufacturerRepository: ManufacturerRepository,
    public readonly carRepository: CarRepository,
    public readonly ownerRepository: OwnerRepository,
  ) {}

  createManufacturer(
    createManufacturer: ManufacturerCreateDto,
  ): Promise<ManufacturerEntity> {
    const manufacturer = this.manufacturerRepository.create(createManufacturer);
    return this.manufacturerRepository.save(manufacturer);
  }

  async createCar(createCar: CarCreateDto): Promise<CarEntity> {
    const manufacturer = await this.manufacturerRepository.findOne({
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

  async createOwner(createOwner: OwnerCreateDto): Promise<OwnerEntity> {
    const car = await this.carRepository.findOne({
      id: createOwner.carId,
    });
    if (!car) {
      throw new RelationNotFoundException();
    }
    const owner = this.ownerRepository.create({
      car,
      name: createOwner.name,
      purchaseDate: createOwner.purchaseDate,
    });
    return this.ownerRepository.save(owner);
  }

  deleteManufacturers(): Promise<DeleteResult> {
    return this.manufacturerRepository.delete({});
  }

  deleteCars(): Promise<DeleteResult> {
    return this.carRepository.delete({});
  }

  deleteOwners(): Promise<DeleteResult> {
    return this.ownerRepository.delete({});
  }

  getManufacturer(id: string): Promise<ManufacturerEntity> {
    return this.manufacturerRepository.findOne(id);
  }

  getCar(id: string): Promise<CarEntity> {
    return this.carRepository.findOne(id);
  }

  getOwner(id: string): Promise<OwnerEntity> {
    return this.ownerRepository.findOne(id);
  }
}
