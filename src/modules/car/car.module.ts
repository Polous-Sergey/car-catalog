import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarController } from './car.controller';
import { CarRepository } from './car.repository';
import { CarService } from './car.service';

@Module({
    imports: [TypeOrmModule.forFeature([CarRepository])],
    controllers: [CarController],
    exports: [CarService],
    providers: [CarService],
})
export class CarModule {}
