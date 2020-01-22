import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarRepository } from '../car/car.repository';
import { CarService } from '../car/car.service';
import { ManufacturerRepository } from '../manufacturer/manufacturer.repository';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { OwnerController } from './owner.controller';
import { OwnerRepository } from './owner.repository';
import { OwnerService } from './owner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OwnerRepository,
      CarRepository,
      ManufacturerRepository,
    ]),
  ],
  controllers: [OwnerController],
  exports: [OwnerService],
  providers: [OwnerService, CarService, ManufacturerService],
})
export class OwnerModule {}
