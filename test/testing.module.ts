import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DbTestHelperService } from './db-test-helper.service';
import { CarRepository } from '../src/modules/car/car.repository';
import { OwnerRepository } from '../src/modules/owner/owner.repository';
import { ManufacturerRepository } from '../src/modules/manufacturer/manufacturer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OwnerRepository,
      CarRepository,
      ManufacturerRepository,
    ]),
  ],
  exports: [DbTestHelperService],
  providers: [DbTestHelperService],
})
export class TestingModule {}
