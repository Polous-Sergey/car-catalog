import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnerController } from './owner.controller';
import { OwnerRepository } from './owner.repository';
import { OwnerService } from './owner.service';

@Module({
    imports: [TypeOrmModule.forFeature([OwnerRepository])],
    controllers: [OwnerController],
    exports: [OwnerService],
    providers: [OwnerService],
})
export class OwnerModule {}
