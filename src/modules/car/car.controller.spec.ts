import { Test, TestingModule as NestTestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataTestHelperService } from '../../../test/data-test-helper';
import { DbTestHelperService } from '../../../test/db-test-helper.service';
import { TestingModule } from '../../../test/testing.module';
import { ConfigService } from '../../shared/services/config.service';
import { SharedModule } from '../../shared/shared.module';
import { ManufacturerCreateDto } from '../manufacturer/dto/ManufacturerCreateDto';
import { OwnerCreateDto } from '../owner/dto/OwnerCreateDto';
import { CarController } from './car.controller';
import { CarModule } from './car.module';
import { CarCreateDto } from './dto/CarCreateDto';
import { CarsPageOptionsDto } from './dto/CarsPageOptionsDto';
import { CarUpdateDto } from './dto/CarUpdateDto';

describe('CarController', () => {
  const dataTestHelperService = new DataTestHelperService();

  let module: NestTestingModule;
  let carController: CarController;
  let dbTestHelperService: DbTestHelperService;

  let uuidString: string;
  let createManufacturer: ManufacturerCreateDto;
  let createCar: CarCreateDto;
  let updatedCar: CarUpdateDto;
  let createOwner: OwnerCreateDto;

  beforeAll(() => {
    uuidString = dataTestHelperService.getUuidString();
    createManufacturer = dataTestHelperService.getCreateManufacturer();
    createCar = dataTestHelperService.getCreateCar();
    updatedCar = dataTestHelperService.getUpdateCar();
    createOwner = dataTestHelperService.getCreateOwner();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CarModule,
        TestingModule,
        TypeOrmModule.forRootAsync({
          imports: [SharedModule],
          useFactory: (configService: ConfigService) =>
            configService.typeOrmConfig,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    carController = module.get<CarController>(CarController);
    dbTestHelperService = module.get<DbTestHelperService>(DbTestHelperService);

    await dbTestHelperService.deleteManufacturers();
  });

  afterEach(async () => {
    await dbTestHelperService.deleteManufacturers();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getCars', () => {
    it('should return an array of cars', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );
      const carId = await dbTestHelperService.createCar(
        createCar,
        manufacturerId,
      );
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await carController.getCars(new CarsPageOptionsDto());

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
          price: expect.any(Number),
          firstRegistrationDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          owners: expect.any(Array),
          manufacturer: expect.any(Object),
        }),
      );
      expect(result.data[0].manufacturer).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(result.data[0].owners).toHaveLength(1);
      expect(result.data[0].owners[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result.data[0]).toHaveProperty('id', carId);
      expect(result.data[0]).toHaveProperty('price', createCar.price);
      expect(result.data[0]).toHaveProperty(
        'firstRegistrationDate',
        new Date(createCar.firstRegistrationDate),
      );
      expect(result.data[0].manufacturer).toHaveProperty('id', manufacturerId);
      expect(result.data[0].manufacturer).toHaveProperty(
        'name',
        createManufacturer.name,
      );
      expect(result.data[0].manufacturer).toHaveProperty(
        'phone',
        createManufacturer.phone,
      );
      expect(result.data[0].manufacturer).toHaveProperty(
        'siret',
        createManufacturer.siret,
      );
      expect(result.data[0].owners[0]).toHaveProperty('id', ownerId);
      expect(result.data[0].owners[0]).toHaveProperty('name', createOwner.name);
      expect(result.data[0].owners[0]).toHaveProperty(
        'purchaseDate',
        new Date(createOwner.purchaseDate),
      );
    });
  });

  describe('getManufacturerByCar', () => {
    it('should return manufacturer', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );
      const carId = await dbTestHelperService.createCar(
        createCar,
        manufacturerId,
      );

      const result = await carController.getManufacturerByCar({ id: carId });

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

      expect(result).toHaveProperty('id', manufacturerId);
      expect(result).toHaveProperty('name', createManufacturer.name);
      expect(result).toHaveProperty('phone', createManufacturer.phone);
      expect(result).toHaveProperty('siret', createManufacturer.siret);
    });

    it('should throw NotFoundException if car not found (getManufacturerByCar)', async () => {
      const result = await carController
        .getManufacturerByCar({ id: uuidString })
        .catch(error => {
          expect(error.getStatus()).toBe(404);
        });

      expect(result).toBe(undefined);
    });
  });

  describe('createCar', () => {
    it('should create car', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );

      const result = await carController.createCar({
        ...createCar,
        manufacturerId,
      });
      const resultFromDb = await dbTestHelperService.getCar(result.id);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          price: expect.any(Number),
          firstRegistrationDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          manufacturer: expect.any(Object),
        }),
      );
      expect(result.manufacturer).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result).toHaveProperty('price', createCar.price);
      expect(result).toHaveProperty(
        'firstRegistrationDate',
        new Date(createCar.firstRegistrationDate),
      );
      expect(result.manufacturer).toHaveProperty('id', manufacturerId);
      expect(result.manufacturer).toHaveProperty(
        'name',
        createManufacturer.name,
      );
      expect(result.manufacturer).toHaveProperty(
        'phone',
        createManufacturer.phone,
      );
      expect(result.manufacturer).toHaveProperty(
        'siret',
        createManufacturer.siret,
      );

      expect(resultFromDb).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          price: expect.any(Number),
          firstRegistrationDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(resultFromDb).toHaveProperty('id', result.id);
      expect(resultFromDb).toHaveProperty('price', createCar.price);
      expect(resultFromDb).toHaveProperty(
        'firstRegistrationDate',
        new Date(createCar.firstRegistrationDate),
      );
    });

    it('should throw RelationNotFoundException if car not found (createCar)', async () => {
      const result = await carController
        .createCar({
          ...createCar,
          manufacturerId: uuidString,
        })
        .catch(error => {
          expect(error.getResponse().message).toBe('error.relation_not_found');
          expect(error.getStatus()).toBe(404);
        });

      expect(result).toBe(undefined);
    });
  });

  describe('updateCar', () => {
    it('should update car', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );
      const newManufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );
      const carId = await dbTestHelperService.createCar(
        createCar,
        manufacturerId,
      );
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await carController.updateCar(
        {
          ...updatedCar,
          manufacturerId: newManufacturerId,
        },
        { id: carId },
      );
      const resultFromDb = await dbTestHelperService.getCar(carId);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          price: expect.any(Number),
          firstRegistrationDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          owners: expect.any(Array),
          manufacturer: expect.any(Object),
        }),
      );
      expect(result.manufacturer).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          siret: expect.any(Number),
          phone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(result.owners).toHaveLength(1);
      expect(result.owners[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          purchaseDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result).toHaveProperty('id', carId);
      expect(result).toHaveProperty('price', updatedCar.price);
      expect(result).toHaveProperty(
        'firstRegistrationDate',
        new Date(updatedCar.firstRegistrationDate),
      );
      expect(result.manufacturer).toHaveProperty('id', newManufacturerId);
      expect(result.manufacturer).toHaveProperty(
        'name',
        createManufacturer.name,
      );
      expect(result.manufacturer).toHaveProperty(
        'phone',
        createManufacturer.phone,
      );
      expect(result.manufacturer).toHaveProperty(
        'siret',
        createManufacturer.siret,
      );
      expect(result.owners[0]).toHaveProperty('id', ownerId);
      expect(result.owners[0]).toHaveProperty('name', createOwner.name);
      expect(result.owners[0]).toHaveProperty(
        'purchaseDate',
        new Date(createOwner.purchaseDate),
      );

      expect(resultFromDb).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          price: expect.any(Number),
          firstRegistrationDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(resultFromDb).toHaveProperty('id', carId);
      expect(resultFromDb).toHaveProperty('price', updatedCar.price);
      expect(resultFromDb).toHaveProperty(
        'firstRegistrationDate',
        new Date(updatedCar.firstRegistrationDate),
      );
    });

    it('should throw NotFoundException if car not found (updateCar)', async () => {
      const result = await carController
        .updateCar(
          {
            ...updatedCar,
            manufacturerId: uuidString,
          },
          { id: uuidString },
        )
        .catch(error => {
          expect(error.getStatus()).toBe(404);
        });

      expect(result).toBe(undefined);
    });

    it('should throw RelationNotFoundException if manufacturer not found (updateCar)', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );
      const carId = await dbTestHelperService.createCar(
        createCar,
        manufacturerId,
      );

      const result = await carController
        .updateCar(
          {
            ...updatedCar,
            manufacturerId: uuidString,
          },
          { id: carId },
        )
        .catch(error => {
          expect(error.getResponse().message).toBe('error.relation_not_found');
          expect(error.getStatus()).toBe(404);
        });

      expect(result).toBe(undefined);
    });
  });

  describe('deleteCar', () => {
    it('should delete car', async () => {
      const manufacturerId = await dbTestHelperService.createManufacturer(
        createManufacturer,
      );
      const carId = await dbTestHelperService.createCar(
        createCar,
        manufacturerId,
      );
      const ownerId = await dbTestHelperService.createOwner(createOwner, carId);

      const result = await carController.deleteCar({ id: carId });
      const resultFromCarDb = await dbTestHelperService.getCar(carId);
      const resultFromOwnerDb = await dbTestHelperService.getOwner(ownerId);

      expect(result).toBe(undefined);
      expect(resultFromCarDb).toBe(undefined);
      expect(resultFromOwnerDb).toBe(undefined);
    });

    it('should throw NotFoundException if car not found (updateCar)', async done => {
      await carController
        .deleteCar({ id: uuidString })
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
