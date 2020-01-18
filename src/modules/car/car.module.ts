import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { CarController } from './car.controller';
import { CarRepository } from './car.repository';
import { CarService } from './car.service';
import { ManufacturerRepository } from '../manufacturer/manufacturer.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CarRepository, ManufacturerRepository])],
    controllers: [CarController],
    exports: [CarService],
    providers: [CarService, ManufacturerService],
})
export class CarModule {}
