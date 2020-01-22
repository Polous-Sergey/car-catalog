import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerRepository } from './manufacturer.repository';
import { ManufacturerService } from './manufacturer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ManufacturerRepository])],
  controllers: [ManufacturerController],
  exports: [ManufacturerService],
  providers: [ManufacturerService],
})
export class ManufacturerModule {}
