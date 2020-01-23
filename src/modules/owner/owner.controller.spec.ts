import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerController } from './owner.controller';
import { OwnerModule } from './owner.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { OwnersPageOptionsDto } from './dto/OwnersPageOptionsDto';
import { OwnerCreateDto } from './dto/OwnerCreateDto';
import { OwnerUpdateDto } from './dto/OwnerUpdateDto';
import { DbTestHelperService } from '../../../test/db-test-helper.service';
import { ManufacturerCreateDto } from '../manufacturer/dto/ManufacturerCreateDto';
import { CarCreateDto } from '../car/dto/CarCreateDto';
import { TestingModule } from '../../../test/testing.module';

describe('CatsController', () => {
  let ownerController: OwnerController;
  let dbTestHelperService: DbTestHelperService;

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
      ]
    }).compile();

    ownerController = module.get<OwnerController>(OwnerController);
    dbTestHelperService = module.get<DbTestHelperService>(DbTestHelperService);

    await dbTestHelperService.deleteManufacturers();
  });

  afterEach(async () => {
    await dbTestHelperService.deleteManufacturers();
  });

  const createManufacturer = new ManufacturerCreateDto();
  createManufacturer.name = 'Ubisoft';
  createManufacturer.siret = 79465211500013;
  createManufacturer.phone = '+380954859357';

  const createCar = new CarCreateDto();
  createCar.price = 333.33;
  createCar.firstRegistrationDate = '2020-01-23T09:44:20.280Z';

  const createOwner = new OwnerCreateDto();
  createOwner.name = 'Sergey';
  createOwner.purchaseDate = '2020-01-23T06:54:24.461Z';

  describe('findAll', () => {
    it('should return an array of owners', async () => {
      const { id: manufacturerId } = await dbTestHelperService.createManufacturer(createManufacturer);
      const { id: carId } = await dbTestHelperService.createCar({
        ...createCar,
        manufacturerId
      });
      await dbTestHelperService.createOwner({
        ...createOwner,
        carId
      });

      const result  = await ownerController.getOwners(new OwnersPageOptionsDto);

      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe(createOwner.name);
      expect(result.data[0].purchaseDate.toISOString()).toBe(createOwner.purchaseDate);
    });

    it('should create owner', async () => {
      const { id: manufacturerId } = await dbTestHelperService.createManufacturer(createManufacturer);
      const { id: carId } = await dbTestHelperService.createCar({
        ...createCar,
        manufacturerId
      });

      const result  = await ownerController.createOwner({
        ...createOwner,
        carId
      });
      const resultFromDb = await dbTestHelperService.getOwner(result.id);

      expect(result.name).toBe(createOwner.name);
      expect(result.purchaseDate.toISOString()).toBe(createOwner.purchaseDate);
      expect(result.car.id).toBe(carId);
      expect(result.car.price).toBe(createCar.price);
      expect(result.car.firstRegistrationDate.toISOString()).toBe(createCar.firstRegistrationDate);

      expect(resultFromDb.name).toBe(createOwner.name);
      expect(resultFromDb.purchaseDate.toISOString()).toBe(createOwner.purchaseDate);
    });

    it('should update owner', async () => {
      const updatedOwner = new OwnerUpdateDto();
      updatedOwner.name = 'Daria';
      updatedOwner.purchaseDate = '2019-01-23T09:44:40.010Z';

      const { id: manufacturerId } = await dbTestHelperService.createManufacturer(createManufacturer);
      const { id: carId } = await dbTestHelperService.createCar({
        ...createCar,
        manufacturerId
      });
      const { id: newCarId } = await dbTestHelperService.createCar({
        ...createCar,
        manufacturerId
      });
      await dbTestHelperService.createOwner({
        ...createOwner,
        carId
      });

      const result  = await ownerController.createOwner({
        ...updatedOwner,
        carId: newCarId
      });
      const resultFromDb = await dbTestHelperService.getOwner(result.id);

      expect(result.name).toBe(updatedOwner.name);
      expect(result.purchaseDate.toISOString()).toBe(updatedOwner.purchaseDate);
      expect(result.car.id).toBe(newCarId);
      expect(result.car.price).toBe(createCar.price);
      expect(result.car.firstRegistrationDate.toISOString()).toBe(createCar.firstRegistrationDate);

      expect(resultFromDb.name).toBe(updatedOwner.name);
      expect(resultFromDb.purchaseDate.toISOString()).toBe(updatedOwner.purchaseDate);
    });

    it('should delete owner', async () => {
      const { id: manufacturerId } = await dbTestHelperService.createManufacturer(createManufacturer);
      const { id: carId } = await dbTestHelperService.createCar({
        ...createCar,
        manufacturerId
      });
      const { id: ownerId } = await dbTestHelperService.createOwner({
        ...createOwner,
        carId
      });


      const result  = await ownerController.deleteOwner({ id: ownerId });
      const resultFromDb = await dbTestHelperService.getOwner(ownerId);

      expect(result.affected).toBe(1);
      expect(resultFromDb).toBe(undefined);
    });
  });
});