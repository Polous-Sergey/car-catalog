import { Injectable } from '@nestjs/common';

import { ManufacturerCreateDto } from '../src/modules/manufacturer/dto/ManufacturerCreateDto';
import { CarCreateDto } from '../src/modules/car/dto/CarCreateDto';
import { OwnerCreateDto } from '../src/modules/owner/dto/OwnerCreateDto';
import { OwnerUpdateDto } from '../src/modules/owner/dto/OwnerUpdateDto';
import { CarUpdateDto } from '../src/modules/car/dto/CarUpdateDto';
import { ManufacturerUpdateDto } from '../src/modules/manufacturer/dto/ManufacturerUpdateDto';

@Injectable()
export class DataTestHelperService {
  constructor() {}

  getUuidString(): string {
    return 'ddfb2712-213d-49eb-9fb9-0b79a8aba6ee';
  }

  getCreateManufacturer(): ManufacturerCreateDto {
    const createManufacturer = new ManufacturerCreateDto();
    createManufacturer.name = 'Ubisoft';
    createManufacturer.siret = 79465211500013;
    createManufacturer.phone = '+380954859357';
    return createManufacturer;
  }

  getUpdateManufacturer(): ManufacturerUpdateDto {
    const updateManufacturer = new ManufacturerUpdateDto();
    updateManufacturer.name = 'Steam';
    updateManufacturer.siret = 39465211500015;
    updateManufacturer.phone = '+380954859457';
    return updateManufacturer;
  }

  getCreateCar(): CarCreateDto {
    const createCar = new CarCreateDto();
    createCar.price = 333.33;
    createCar.firstRegistrationDate = '2020-01-23T09:44:20.280Z';
    return createCar;
  }

  getUpdateCar(): CarUpdateDto {
    const updateCar = new CarUpdateDto();
    updateCar.price = 444.44;
    updateCar.firstRegistrationDate = '2020-01-15T10:22:11.461Z';
    return updateCar;
  }

  getCreateOwner(): OwnerCreateDto {
    const createOwner = new OwnerCreateDto();
    createOwner.name = 'Sergey';
    createOwner.purchaseDate = '2020-01-23T06:54:24.461Z';
    return createOwner;
  }

  getUpdateOwner(): OwnerUpdateDto {
    const updatedOwner = new OwnerUpdateDto();
    updatedOwner.name = 'Daria';
    updatedOwner.purchaseDate = '2019-01-23T09:44:40.010Z';
    return updatedOwner;
  }
}
