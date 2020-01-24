import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerController } from './owner.controller';
import { OwnerModule } from './owner.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { OwnersPageOptionsDto } from './dto/OwnersPageOptionsDto';
import { OwnerUpdateDto } from './dto/OwnerUpdateDto';
import { DbTestHelperService } from '../../../test/db-test-helper.service';
import { TestingModule } from '../../../test/testing.module';
import { DataTestHelperService } from '../../../test/data-test-helper';
import { CarCreateDto } from '../car/dto/CarCreateDto';
import { OwnerCreateDto } from './dto/OwnerCreateDto';
import { ManufacturerCreateDto } from '../manufacturer/dto/ManufacturerCreateDto';

describe('OwnerController', () => {
  const dataTestHelperService = new DataTestHelperService();

  let ownerController: OwnerController;
  let dbTestHelperService: DbTestHelperService;

  let uuidString: string;
  let createManufacturer: ManufacturerCreateDto;
  let createCar: CarCreateDto;
  let createOwner: OwnerCreateDto;
  let updatedOwner: OwnerUpdateDto;


  beforeAll(() => {
    uuidString = dataTestHelperService.getUuidString();
    createManufacturer = dataTestHelperService.getCreateManufacturer();
    createCar = dataTestHelperService.getCreateCar();
    createOwner = dataTestHelperService.getCreateOwner();
    updatedOwner = dataTestHelperService.getUpdateOwner();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        OwnerModule,
        TestingModule,
        TypeOrmModule.forRootAsync({
          imports: [SharedModule],
          useFactory: (configService: ConfigService) => configService.typeOrmConfig,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    ownerController = module.get<OwnerController>(OwnerController);
    dbTestHelperService = module.get<DbTestHelperService>(DbTestHelperService);

    await dbTestHelperService.deleteManufacturers();
  });

  afterEach(async () => {
    await dbTestHelperService.deleteManufacturers();
  });

  describe('getOwners', () => {
    it('should return an array of owners', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);
      const carId = await dbTestHelperService.createCar(createCar, manufacturerId);
      await dbTestHelperService.createOwner(createOwner, carId);

      const result = await ownerController.getOwners(new OwnersPageOptionsDto);

      expect(result.data).toHaveLength(1);
      expect(result).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          meta: expect.objectContaining({
            page: expect.any(Number),
            take: expect.any(Number),
            itemCount: expect.any(Number),
            pageCount: expect.any(Number),
          }),
        }),
      );
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result.data[0]).toHaveProperty('name', createOwner.name);
      expect(result.data[0]).toHaveProperty('purchaseDate', new Date(createOwner.purchaseDate));
    });
  });

  describe('createOwner', () => {
    it('should create owner', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);
      const carId = await dbTestHelperService.createCar(createCar, manufacturerId);

      const result = await ownerController.createOwner({
        ...createOwner,
        carId,
      });
      const resultFromDb = await dbTestHelperService.getOwner(result.id);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          car: expect.objectContaining({
            id: expect.any(String),
            price: expect.any(Number),
            firstRegistrationDate: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }),
        }),
      );

      expect(result).toHaveProperty('name', createOwner.name);
      expect(result).toHaveProperty('purchaseDate', new Date(createOwner.purchaseDate));
      expect(result.car).toHaveProperty('id', carId);
      expect(result.car).toHaveProperty('price', createCar.price);
      expect(result.car).toHaveProperty('firstRegistrationDate', new Date(createCar.firstRegistrationDate));

      expect(resultFromDb).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(resultFromDb).toHaveProperty('name', createOwner.name);
      expect(resultFromDb).toHaveProperty('purchaseDate', new Date(createOwner.purchaseDate));
    });

    it('should throw RelationNotFoundException if car not found (createOwner)', async () => {
      const result = await ownerController.createOwner({
        ...createOwner,
        carId: uuidString,
      }).catch(error => {
        expect(error.getResponse().message).toBe('error.relation_not_found');
        expect(error.getStatus()).toBe(404);
      });

      expect(result).toBe(undefined);
    });
  });

  describe('updateOwner', () => {
    it('should update owner', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);
      const carId = await dbTestHelperService.createCar(createCar, manufacturerId);
      const newCarId = await dbTestHelperService.createCar(createCar, manufacturerId);
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await ownerController.updateOwner({
        ...updatedOwner,
        carId: newCarId,
      }, { id: ownerId });
      const resultFromDb = await dbTestHelperService.getOwner(ownerId);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          car: expect.objectContaining({
            id: expect.any(String),
            price: expect.any(Number),
            firstRegistrationDate: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }),
        }),
      );

      expect(result).toHaveProperty('name', updatedOwner.name);
      expect(result).toHaveProperty('purchaseDate', new Date(updatedOwner.purchaseDate));
      expect(result.car).toHaveProperty('id', newCarId);
      expect(result.car).toHaveProperty('price', createCar.price);

      expect(resultFromDb).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(resultFromDb).toHaveProperty('name', updatedOwner.name);
      expect(resultFromDb).toHaveProperty('purchaseDate', new Date(updatedOwner.purchaseDate));
    });

    it('should throw NotFoundException if owner not found (updateOwner)', async () => {
      const result = await ownerController.updateOwner({
        ...updatedOwner,
        carId: uuidString,
      }, { id: uuidString }).catch(error => {
        expect(error.getStatus()).toBe(404);
      });

      expect(result).toBe(undefined);
    });

    it('should throw RelationNotFoundException if car not found (updateOwner)', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);
      const carId = await dbTestHelperService.createCar(createCar, manufacturerId);
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await ownerController.updateOwner({
        ...updatedOwner,
        carId: uuidString,
      }, { id: ownerId }).catch(error => {
        expect(error.getResponse().message).toBe('error.relation_not_found');
        expect(error.getStatus()).toBe(404);
      });

      expect(result).toBe(undefined);
    });
  });

  describe('deleteOwner', () => {
    it('should delete owner', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);
      const carId = await dbTestHelperService.createCar(createCar, manufacturerId);
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await ownerController.deleteOwner({ id: ownerId });
      const resultFromDb = await dbTestHelperService.getOwner(ownerId);

      expect(result).toBe(undefined);
      expect(resultFromDb).toBe(undefined);
    });

    it('should throw NotFoundException if owner not found (updateOwner)', async (done) => {
      await ownerController.deleteOwner({ id: uuidString })
        .then(() => {
          done.fail('should return NotFoundException error of 404 but did not');
        })
        .catch(error => {
          expect(error.getStatus()).toBe(404);
        });
      done();
    });
  });
});