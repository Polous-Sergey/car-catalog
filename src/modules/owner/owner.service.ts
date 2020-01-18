import { Injectable } from '@nestjs/common';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { OwnerCreateDto } from './dto/OwnerCreateDto';
import { OwnersPageDto } from './dto/OwnersPageDto';
import { OwnersPageOptionsDto } from './dto/OwnersPageOptionsDto';
import { OwnerUpdateDto } from './dto/OwnerUpdateDto';
import { OwnerEntity } from './owner.entity';
import { OwnerRepository } from './owner.repository';

@Injectable()
export class OwnerService {
    constructor(public readonly ownerRepository: OwnerRepository) {}

    findOne(findData: FindConditions<OwnerEntity>): Promise<OwnerEntity> {
        return this.ownerRepository.findOne(findData);
    }

    async createOwner(createOwner: OwnerCreateDto): Promise<OwnerEntity> {
        const owner = this.ownerRepository.create(createOwner);
        return this.ownerRepository.save(owner);
    }

    async updateOwner(
        ownerUpdate: OwnerUpdateDto,
        ownerId: string,
    ): Promise<UpdateResult> {
        return this.ownerRepository.update(ownerId, ownerUpdate);
    }

    async deleteOwner(ownerId: string): Promise<DeleteResult> {
        return this.ownerRepository.delete(ownerId);
    }

    async getOwners(pageOptions: OwnersPageOptionsDto): Promise<OwnersPageDto> {
        const queryBuilder = this.ownerRepository.createQueryBuilder('owner');
        const [owners, ownersCount] = await queryBuilder
            .skip(pageOptions.skip)
            .take(pageOptions.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto: pageOptions,
            itemCount: ownersCount,
        });
        return new OwnersPageDto(owners, pageMetaDto);
    }
}
