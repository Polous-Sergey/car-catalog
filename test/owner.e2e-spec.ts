import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { OwnerController } from '../src/modules/owner/owner.controller';
import { OwnerService } from '../src/modules/owner/owner.service';

describe('OwnerController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OwnerController],
      providers: [
        {
          provide: OwnerService,
          useFactory: () => ({
            findOne: jest.fn(() => {
              return true;
            }),

            createOwner: jest.fn(() => {
              return true;
            }),

            updateOwner: jest.fn(() => {
              return true;
            }),

            deleteOwner: jest.fn(() => {
              return true;
            }),

            getOwners: jest.fn(() => {
              return true;
            }),
          }),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const validOwner = {
    name: 'Name',
    carId: 'a9345928-034b-4120-a4ba-52c2b73f68a3',
    purchaseDate: '2017-06-07T14:34:08.700Z',
  };

  const validUID = 'f96f3653-b5e7-472c-b3f5-e6dc933eb042';

  it('/ (POST)', (done) => {
    return request(app.getHttpServer())
      .post('/owner')
      .send(validOwner)
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (POST) purchaseDate', (done) => {
    return request(app.getHttpServer())
      .post('/owner')
      .send({
        ...validOwner,
        purchaseDate: 'invalid date',
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (POST) carId', (done) => {
    return request(app.getHttpServer())
      .post('/owner')
      .send({
        ...validOwner,
        carId: 'invalid-id',
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (GET)', (done) => {
    return request(app.getHttpServer())
      .get('/owner')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (PUT)', (done) => {
    return request(app.getHttpServer())
      .put('/owner')
      .query({ id: validUID })
      .send(validOwner)
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (PUT) id', (done) => {
    return request(app.getHttpServer())
      .put('/owner')
      .query({ id: 'invalid-id' })
      .send(validOwner)
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (PUT) purchaseDate', (done) => {
    return request(app.getHttpServer())
      .put('/owner')
      .query({ id: validUID })
      .send({
        ...validOwner,
        purchaseDate: 'invalid date',
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (PUT) carId', (done) => {
    return request(app.getHttpServer())
      .put('/owner')
      .query({ id: validUID })
      .send({
        ...validOwner,
        carId: 'invalid-id',
      })
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('/ (Delete)', (done) => {
    return request(app.getHttpServer())
      .delete('/owner')
      .query({ id: validUID })
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('/ (Delete) id', (done) => {
    return request(app.getHttpServer())
      .delete('/owner')
      .query({ id: 'invalid-id' })
      .set('Accept', 'application/json')
      .expect(400, done);
  });
});
