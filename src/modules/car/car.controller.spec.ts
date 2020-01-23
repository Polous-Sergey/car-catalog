import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerModule } from './manufacturer.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { ManufacturerRepository } from './manufacturer.repository';
import { ManufacturerEntity } from './manufacturer.entity';
import { ManufacturersPageOptionsDto } from './dto/ManufacturersPageOptionsDto';

describe('CatsController', () => {
  let manufacturerController: ManufacturerController;
  let manufacturerRepository: ManufacturerRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ManufacturerModule,
        TypeOrmModule.forRootAsync({
          imports: [SharedModule],
          useFactory: (configService: ConfigService) => configService.typeOrmConfig,
          inject: [ConfigService],
        }),
      ],
    }).compile();

    manufacturerController = module.get<ManufacturerController>(ManufacturerController);
    manufacturerRepository = module.get<ManufacturerRepository>(ManufacturerRepository);

    await manufacturerRepository.query(`DELETE FROM manufacturers;`);
  });

  afterEach(async () => {
    await manufacturerRepository.query(`DELETE FROM manufacturers;`);
  });

  const manufacturer = new ManufacturerEntity();
  manufacturer.name = 'Ubisoft';
  manufacturer.siret = 79465211500013;
  manufacturer.phone = '+380954859357';

  describe('findAll', () => {
    it('should return an array of manufacturer', async () => {
      await manufacturerRepository.save([
        manufacturer
      ]);

      const result  = await manufacturerController.getManufacturers(new ManufacturersPageOptionsDto);

      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe(manufacturer.name);
      expect(result.data[0].siret).toBe(manufacturer.siret);
      expect(result.data[0].phone).toBe(manufacturer.phone);
    });

    it('should create manufacturer', async () => {
      const result  = await manufacturerController.createManufacturer(manufacturer);
      const resultFromDb = await manufacturerRepository.findOne(result.id);

      expect(result.name).toBe(manufacturer.name);
      expect(result.siret).toBe(manufacturer.siret);
      expect(result.phone).toBe(manufacturer.phone);
      expect(resultFromDb.name).toBe(manufacturer.name);
      expect(resultFromDb.siret).toBe(manufacturer.siret);
      expect(resultFromDb.phone).toBe(manufacturer.phone);
    });

    it('should update manufacturer', async () => {
      const updatedManufacturer = new ManufacturerEntity();
      updatedManufacturer.name = 'Steam';
      updatedManufacturer.siret = 79465211500015;
      updatedManufacturer.phone = '+380954859358';


      const { id } = await manufacturerRepository.save(manufacturer);
      const result  = await manufacturerController.updateManufacturer(updatedManufacturer, { id });
      const resultFromDb = await manufacturerRepository.findOne(id);

      expect(result.affected).toBe(1);
      expect(resultFromDb.name).toBe(updatedManufacturer.name);
      expect(resultFromDb.siret).toBe(updatedManufacturer.siret);
      expect(resultFromDb.phone).toBe(updatedManufacturer.phone);
    });

    it('should delete manufacturer', async () => {
      const { id } = await manufacturerRepository.save(manufacturer);
      const result  = await manufacturerController.deleteManufacturer({ id });
      const resultFromDb = await manufacturerRepository.findOne(id);

      expect(result.affected).toBe(1);
      expect(resultFromDb).toBe(undefined);
    });
  });
});