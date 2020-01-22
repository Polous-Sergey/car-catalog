import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CarController } from '../src/modules/car/car.controller';
import { CarService } from '../src/modules/car/car.service';

describe('CarController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useFactory: () => ({
            findOne: jest.fn(() => {
              return true;
            }),

            createCar: jest.fn(() => {
              return true;
            }),

            updateCar: jest.fn(() => {
              return true;
            }),

            deleteCar: jest.fn(() => {
              return true;
            }),

            getCars: jest.fn(() => {
              return true;
            }),
          }),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const validCar = {
    manufacturerId: 'bc3ebd64-ad55-433c-af66-8def369d0dd9',
    price: 2000,
    firstRegistrationDate: '2017-06-07T14:34:08.700Z',
  };

  const validUID = 'f96f3653-b5e7-472c-b3f5-e6dc933eb042';

  it('/ (POST)', (done) => {
    return request(app.getHttpServer())
      .post('/car')
      .send(validCar)
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (POST) firstRegistrationDate', (done) => {
    return request(app.getHttpServer())
      .post('/car')
      .send({
        ...validCar,
        firstRegistrationDate: 'invalid date',
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (POST) price', (done) => {
    return request(app.getHttpServer())
      .post('/car')
      .send({
        ...validCar,
        price: 21474837,
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (GET)', (done) => {
    return request(app.getHttpServer())
      .get('/car')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (PUT)', (done) => {
    return request(app.getHttpServer())
      .put('/car')
      .query({ id: validUID })
      .send(validCar)
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (PUT) id', (done) => {
    return request(app.getHttpServer())
      .put('/car')
      .query({ id: 'invalid' })
      .send(validCar)
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (PUT) firstRegistrationDate', (done) => {
    return request(app.getHttpServer())
      .put('/car')
      .query({ id: validUID })
      .send({
        ...validCar,
        firstRegistrationDate: 'invalid date',
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (PUT) price', (done) => {
    return request(app.getHttpServer())
      .put('/car')
      .query({ id: validUID })
      .send({
        ...validCar,
        price: 21474837,
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (Delete)', (done) => {
    return request(app.getHttpServer())
      .delete('/car')
      .query({ id: validUID })
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (Delete) id', (done) => {
    return request(app.getHttpServer())
      .delete('/car')
      .query({ id: 'invalid' })
      .set('Accept', 'application/json')
      .expect(400, done);
  });
});
