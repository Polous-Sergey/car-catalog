import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarModule } from './modules/car/car.module';
import { ManufacturerModule } from './modules/manufacturer/manufacturer.module';
import { OwnerModule } from './modules/owner/owner.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    CarModule,
    ManufacturerModule,
    OwnerModule,
    ScheduleModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
