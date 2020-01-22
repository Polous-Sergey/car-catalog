import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnerRepository } from '../owner/owner.repository';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [TypeOrmModule.forFeature([OwnerRepository])],
    exports: [ScheduleService],
    providers: [ScheduleService],
})
export class ScheduleModule {}
