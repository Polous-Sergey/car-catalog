import { Test, TestingModule as NestTestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerModule } from './manufacturer.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { ManufacturersPageOptionsDto } from './dto/ManufacturersPageOptionsDto';
import { ManufacturerUpdateDto } from './dto/ManufacturerUpdateDto';
import { DbTestHelperService } from '../../../test/db-test-helper.service';
import { TestingModule } from '../../../test/testing.module';
import { DataTestHelperService } from '../../../test/data-test-helper';
import { ManufacturerCreateDto } from './dto/ManufacturerCreateDto';
import { CarCreateDto } from '../car/dto/CarCreateDto';
import { OwnerCreateDto } from '../owner/dto/OwnerCreateDto';

describe('ManufacturerController', () => {
  const dataTestHelperService = new DataTestHelperService();

  let module: NestTestingModule;
  let manufacturerController: ManufacturerController;
  let dbTestHelperService: DbTestHelperService;

  let uuidString: string;
  let createManufacturer: ManufacturerCreateDto;
  let updatedManufacturer: ManufacturerUpdateDto;
  let createCar: CarCreateDto;
  let createOwner: OwnerCreateDto;


  beforeAll(() => {
    uuidString = dataTestHelperService.getUuidString();
    createManufacturer = dataTestHelperService.getCreateManufacturer();
    updatedManufacturer = dataTestHelperService.getUpdateManufacturer();
    createCar = dataTestHelperService.getCreateCar();
    createOwner = dataTestHelperService.getCreateOwner();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ManufacturerModule,
        TestingModule,
        TypeOrmModule.forRootAsync({
          imports: [SharedModule],
          useFactory: (configService: ConfigService) => configService.typeOrmConfig,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    manufacturerController = module.get<ManufacturerController>(ManufacturerController);
    dbTestHelperService = module.get<DbTestHelperService>(DbTestHelperService);

    await dbTestHelperService.deleteManufacturers();
  });

  afterEach(async () => {
    await dbTestHelperService.deleteManufacturers();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getManufacturers', () => {
    it('should return an array of manufacturers', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);

      const result = await manufacturerController.getManufacturers(new ManufacturersPageOptionsDto);

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
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result.data[0]).toHaveProperty('id', manufacturerId);
      expect(result.data[0]).toHaveProperty('name', createManufacturer.name);
      expect(result.data[0]).toHaveProperty('phone', createManufacturer.phone);
      expect(result.data[0]).toHaveProperty('siret', createManufacturer.siret);
    });
  });

  describe('createManufacturer', () => {
    it('should create manufacturer', async () => {
      const result = await manufacturerController.createManufacturer({
        ...createManufacturer,
      });
      const resultFromDb = await dbTestHelperService.getManufacturer(result.id);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result).toHaveProperty('name', createManufacturer.name);
      expect(result).toHaveProperty('phone', createManufacturer.phone);
      expect(result).toHaveProperty('siret', createManufacturer.siret);

      expect(resultFromDb).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(resultFromDb).toHaveProperty('id', result.id);
      expect(resultFromDb).toHaveProperty('name', createManufacturer.name);
      expect(resultFromDb).toHaveProperty('phone', createManufacturer.phone);
      expect(resultFromDb).toHaveProperty('siret', createManufacturer.siret);
    });
  });

  describe('updateManufacturer', () => {
    it('should update manufacturer', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);

      const result = await manufacturerController.updateManufacturer(
        updatedManufacturer,
        { id: manufacturerId}
        );
      const resultFromDb = await dbTestHelperService.getManufacturer(manufacturerId);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result).toHaveProperty('name', updatedManufacturer.name);
      expect(result).toHaveProperty('phone', updatedManufacturer.phone);
      expect(result).toHaveProperty('siret', updatedManufacturer.siret);

      expect(resultFromDb).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(resultFromDb).toHaveProperty('id', manufacturerId);
      expect(resultFromDb).toHaveProperty('name', updatedManufacturer.name);
      expect(resultFromDb).toHaveProperty('phone', updatedManufacturer.phone);
      expect(resultFromDb).toHaveProperty('siret', updatedManufacturer.siret);
    });

    it('should throw NotFoundException if manufacturer not found (updateManufacturer)', async (done) => {
      await manufacturerController.updateManufacturer(
        updatedManufacturer,
        { id: uuidString },
      )
        .then(() => {
          done.fail('should return NotFoundException error of 404 but did not');
        })
        .catch(error => {
          expect(error.getStatus()).toBe(404);
        });
      done();
    });
  });

  describe('deleteManufacturer', () => {
    it('should delete manufacturer', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(createManufacturer);
      const carId = await dbTestHelperService.createCar(createCar, manufacturerId);
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await manufacturerController.deleteManufacturer({ id: manufacturerId });
      const resultFromManufacturerDb = await dbTestHelperService.getManufacturer(manufacturerId);
      const resultFromCarDb = await dbTestHelperService.getCar(carId);
      const resultFromOwnerDb = await dbTestHelperService.getOwner(ownerId);

      expect(result).toBe(undefined);
      expect(resultFromManufacturerDb).toBe(undefined);
      expect(resultFromCarDb).toBe(undefined);
      expect(resultFromOwnerDb).toBe(undefined);
    });

    it('should throw NotFoundException if manufacturer not found (deleteManufacturer)', async (done) => {
      await manufacturerController.deleteManufacturer({ id: uuidString })
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