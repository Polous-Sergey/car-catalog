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

  async createManufacturer(createManufacturer: ManufacturerCreateDto): Promise<string> {
    const manufacturer = this.manufacturerRepository.create(createManufacturer);
    const { id: manufacturerId} = await this.manufacturerRepository.save(manufacturer);
    return manufacturerId
  }

  async createCar(createCar: CarCreateDto, manufacturerId: string): Promise<string> {
    const manufacturer = await this.manufacturerRepository.findOne({ id: manufacturerId });
    if (!manufacturer) {
      throw new RelationNotFoundException();
    }
    const car = this.carRepository.create({
      manufacturer,
      price: createCar.price,
      firstRegistrationDate: createCar.firstRegistrationDate,
    });
    const { id: carId } = await this.carRepository.save(car);
    return carId;
  }

  async createOwner(createOwner: OwnerCreateDto, carId: string): Promise<string> {
    const car = await this.carRepository.findOne({ id: carId });
    if (!car) {
      throw new RelationNotFoundException();
    }
    const owner = this.ownerRepository.create({
      car,
      name: createOwner.name,
      purchaseDate: createOwner.purchaseDate,
    });
    const { id: owneId} = await this.ownerRepository.save(owner);
    return owneId;
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
