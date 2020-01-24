import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions } from 'typeorm';

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
    const car = await this._carService.findOne({ id: createOwner.carId });
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

  async updateOwner(
    ownerUpdate: OwnerUpdateDto,
    ownerId: string,
  ): Promise<OwnerEntity> {
    const owner = await this.ownerRepository.findOne({ id: ownerId });
    if (!owner) {
      throw new NotFoundException();
    }

    const queryBuilder = this.ownerRepository
      .createQueryBuilder()
      .update()
      .where('id = :id', { id: ownerId });

    if (ownerUpdate.carId) {
      const car = await this._carService.findOne({ id: ownerUpdate.carId });
      if (!car) {
        throw new RelationNotFoundException();
      }
      queryBuilder.set({ car });
    }

    if (ownerUpdate.name) {
      queryBuilder.set({ name: ownerUpdate.name });
    }
    if (ownerUpdate.purchaseDate) {
      queryBuilder.set({ purchaseDate: ownerUpdate.purchaseDate });
    }

    await queryBuilder.execute();

    return this.ownerRepository.findOne({
      where: { id: ownerId },
      relations: ['car'],
    });
  }

  async deleteOwner(ownerId: string): Promise<void> {
    const { affected } = await this.ownerRepository.delete(ownerId);
    if (!affected) {
      throw new NotFoundException();
    }
    return;
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
