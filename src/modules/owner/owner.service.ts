import { Injectable } from '@nestjs/common';
import { DeleteResult, FindConditions, UpdateResult } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { RelationNotFoundException } from '../../exceptions/relation-not-found.exception';
import { CarService } from '../car/car.service';
import { OwnerCreateDto } from './dto/OwnerCreateDto';
import { OwnersPageDto } from './dto/OwnersPageDto';
import { OwnersPageOptionsDto } from './dto/OwnersPageOptionsDto';
import { OwnerUpdateDto } from './dto/OwnerUpdateDto';
import { OwnerEntity } from './owner.entity';
import { OwnerRepository } from './owner.repository';

@Injectable()
export class OwnerService {
  constructor(
    public readonly ownerRepository: OwnerRepository,
    private _carService: CarService,
  ) {}

  findOne(findData: FindConditions<OwnerEntity>): Promise<OwnerEntity> {
    return this.ownerRepository.findOne(findData);
  }

  async createOwner(createOwner: OwnerCreateDto): Promise<OwnerEntity> {
    const car = await this._carService.findOne({
      id: createOwner.carId,
    });
    if (!car) {
      throw new RelationNotFoundException();
    }
    const owner = this.ownerRepository.create({
      car,
      name: createOwner.name,
      purchaseDate: createOwner.purchaseDate,
    });
    return this.ownerRepository.save(owner);
  }

  updateOwner(
    ownerUpdate: OwnerUpdateDto,
    ownerId: string,
  ): Promise<UpdateResult> {
    return this.ownerRepository.update(ownerId, ownerUpdate);
  }

  deleteOwner(ownerId: string): Promise<DeleteResult> {
    return this.ownerRepository.delete(ownerId);
  }

  async getOwners(pageOptions: OwnersPageOptionsDto): Promise<OwnersPageDto> {
    const queryBuilder = this.ownerRepository.createQueryBuilder('owner');
    const [owners, ownersCount] = await queryBuilder
      .skip(pageOptions.skip)
      .take(pageOptions.take)
      .leftJoinAndSelect('owner.car', 'car')
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: ownersCount,
    });
    return new OwnersPageDto(owners, pageMetaDto);
  }
}
