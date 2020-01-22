import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ManufacturerController } from '../src/modules/manufacturer/manufacturer.controller';
import { ManufacturerService } from '../src/modules/manufacturer/manufacturer.service';

describe('ManufacturerController (e2e)', () => {
    let app;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ManufacturerController],
            providers: [
                {
                    provide: ManufacturerService,
                    useFactory: () => ({
                        findOne: jest.fn(() => {
                            return true;
                        }),

                        createManufacturer: jest.fn(() => {
                            return true;
                        }),

                        updateManufacturer: jest.fn(() => {
                            return true;
                        }),

                        deleteManufacturer: jest.fn(() => {
                            return true;
                        }),

                        getManufacturers: jest.fn(() => {
                            return true;
                        }),
                    }),
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    const validManufacturer = {
        name: 'Ubisoft',
        phone: '+380954859357',
        siret: 79465211500013,
    };

    const validUID = 'f96f3653-b5e7-472c-b3f5-e6dc933eb042';

    it('/ (POST)', (done) => {
        return request(app.getHttpServer())
            .post('/manufacturer')
            .send(validManufacturer)
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('/ (POST) siret', (done) => {
        return request(app.getHttpServer())
            .post('/manufacturer')
            .send({
                ...validManufacturer,
                siret: 7946521150001323,
            })
            .set('Accept', 'application/json')
            .expect(400, done);
    });

    it('/ (POST) phone', (done) => {
        return request(app.getHttpServer())
            .post('/manufacturer')
            .send({
                    ...validManufacturer,
                phone: '0954859357',
            })
            .set('Accept', 'application/json')
            .expect(400, done);
    });

    it('/ (GET)', (done) => {
        return request(app.getHttpServer())
            .get('/manufacturer')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('/ (PUT)', (done) => {
        return request(app.getHttpServer())
            .put('/manufacturer')
            .query({ id: validUID })
            .send(validManufacturer)
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('/ (PUT) id', (done) => {
        return request(app.getHttpServer())
            .put('/manufacturer')
            .query({ id: 'invalid' })
            .send(validManufacturer)
            .set('Accept', 'application/json')
            .expect(400, done);
    });

    it('/ (PUT) siret', (done) => {
        return request(app.getHttpServer())
            .put('/manufacturer')
            .query({ id: validUID })
            .send({
                ...validManufacturer,
                siret: 7946521150001323,
            })
            .set('Accept', 'application/json')
            .expect(400, done);
    });

    it('/ (PUT) phone', (done) => {
        return request(app.getHttpServer())
            .put('/manufacturer')
            .query({ id: validUID })
            .send({
                ...validManufacturer,
                phone: '0954859357',
            })
            .set('Accept', 'application/json')
            .expect(400, done);
    });

    it('/ (Delete)', (done) => {
        return request(app.getHttpServer())
            .delete('/manufacturer')
            .query({ id: validUID })
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('/ (Delete) id', (done) => {
        return request(app.getHttpServer())
            .delete('/manufacturer')
            .query({ id: 'invalid' })
            .set('Accept', 'application/json')
            .expect(400, done);
    });
});
