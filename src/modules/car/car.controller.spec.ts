import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './car.controller';
import { CarModule } from './car.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { CarRepository } from './car.repository';
import { CarsPageOptionsDto } from './dto/CarsPageOptionsDto';
import { ManufacturerRepository } from '../manufacturer/manufacturer.repository';
import { CarCreateDto } from './dto/CarCreateDto';
import { CarUpdateDto } from './dto/CarUpdateDto';
import { ManufacturerCreateDto } from '../manufacturer/dto/ManufacturerCreateDto';

describe.skip('CatsController', () => {
  let carController: CarController;
  let carRepository: CarRepository;
  let manufacturerRepository: ManufacturerRepository;
  let manufacturerId;

  const manufacturer = new ManufacturerCreateDto();
  manufacturer.name = 'Ubisoft';
  manufacturer.siret = 79465211500013;
  manufacturer.phone = '+380954859357';

  const car = new CarCreateDto();
  car.firstRegistrationDate = '2020-01-23T06:54:24.461Z';
  car.price = 333.33;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CarModule,
        TypeOrmModule.forRootAsync({
          imports: [SharedModule],
          useFactory: (configService: ConfigService) => configService.typeOrmConfig,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    carController = module.get<CarController>(CarController);
    carRepository = module.get<CarRepository>(CarRepository);
    manufacturerRepository = module.get<ManufacturerRepository>(ManufacturerRepository);

    manufacturerId = undefined;
    await carRepository.query(`DELETE FROM cars;`);
    await manufacturerRepository.query(`DELETE FROM manufacturers;`);

    const { id } = await manufacturerRepository.save(manufacturer);
    manufacturerId = id
  });

  afterEach(async () => {
    manufacturerId = undefined;
    await carRepository.query(`DELETE FROM cars;`);
    await manufacturerRepository.query(`DELETE FROM manufacturers;`);
  });

  describe('findAll', () => {
    it('should return an array of car', async () => {
      await carRepository.save({
        ...car,
        manufacturerId
      });

      const result  = await carController.getCars(new CarsPageOptionsDto);

      expect(result.data.length).toBe(1);
      expect(result.data[0].price).toBe(car.price);
      expect(result.data[0].firstRegistrationDate).toBe(car.firstRegistrationDate);
    });

    it('should create car', async () => {
      const result  = await carController.createCar(car);
      const resultFromDb = await carRepository.findOne(result.id);

      expect(result.price).toBe(car.price);
      expect(result.firstRegistrationDate).toBe(car.firstRegistrationDate);
      expect(resultFromDb.price).toBe(car.price);
      expect(resultFromDb.firstRegistrationDate).toBe(car.firstRegistrationDate);
    });

    it('should update car', async () => {
      const updatedCar = new CarUpdateDto();
      updatedCar.price = 444.44;
      updatedCar.firstRegistrationDate = '2019-01-23T06:54:24.461Z';


      const { id } = await carRepository.save(car);
      const result  = await carController.updateCar(updatedCar, { id });
      const resultFromDb = await carRepository.findOne(id);

      expect(result.affected).toBe(1);
      expect(resultFromDb.price).toBe(updatedCar.price);
      expect(resultFromDb.firstRegistrationDate).toBe(updatedCar.firstRegistrationDate);
    });

    it('should delete car', async () => {
      const { id } = await carRepository.save(car);
      const result  = await carController.deleteCar({ id });
      const resultFromDb = await carRepository.findOne(id);

      expect(result.affected).toBe(1);
      expect(resultFromDb).toBe(undefined);
    });
  });
});