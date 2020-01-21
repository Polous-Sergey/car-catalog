import { Injectable } from '@nestjs/common';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { ManufacturerCreateDto } from './dto/ManufacturerCreateDto';
import { ManufacturersPageDto } from './dto/ManufacturersPageDto';
import { ManufacturersPageOptionsDto } from './dto/ManufacturersPageOptionsDto';
import { ManufacturerUpdateDto } from './dto/ManufacturerUpdateDto';
import { ManufacturerEntity } from './manufacturer.entity';
import { ManufacturerRepository } from './manufacturer.repository';

@Injectable()
export class ManufacturerService {
    constructor(
        public readonly manufacturerRepository: ManufacturerRepository,
    ) {}

    findOne(
        findData: FindConditions<ManufacturerEntity>,
    ): Promise<ManufacturerEntity> {
        return this.manufacturerRepository.findOne(findData);
    }

    createManufacturer(
        createManufacturer: ManufacturerCreateDto,
    ): Promise<ManufacturerEntity> {
        const manufacturer = this.manufacturerRepository.create(
            createManufacturer,
        );
        return this.manufacturerRepository.save(manufacturer);
    }

    updateManufacturer(
        manufacturerUpdate: ManufacturerUpdateDto,
        manufacturerId: string,
    ): Promise<UpdateResult> {
        return this.manufacturerRepository.update(
            manufacturerId,
            manufacturerUpdate,
        );
    }

    deleteManufacturer(manufacturerId: string): Promise<DeleteResult> {
        return this.manufacturerRepository.delete(manufacturerId);
    }

    async getManufacturers(
        pageOptions: ManufacturersPageOptionsDto,
    ): Promise<ManufacturersPageDto> {
        const queryBuilder = this.manufacturerRepository.createQueryBuilder();
        const [manufacturers, manufacturersCount] = await queryBuilder
            .skip(pageOptions.skip)
            .take(pageOptions.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto: pageOptions,
            itemCount: manufacturersCount,
        });
        return new ManufacturersPageDto(manufacturers, pageMetaDto);
    }
}
