import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('BuildingController (e2e)', () => {
  let app: INestApplication<App>;

  const validBuilding = {
    buildingName: 'Test Tower',
    leaseType: 'MANAGED',
    status: 'ACTIVE',
    address: '1 Test Street',
    lat: 51.5,
    long: -0.1,
    amenities: ['GYM', 'BIKE_RACK'],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /buildings', () => {
    it('creates a building and returns 201 with a buildingId', async () => {
      const res = await request(app.getHttpServer())
        .post('/buildings')
        .send(validBuilding)
        .expect(201);

      expect(res.body.data).toBeDefined();
      expect(typeof res.body.data.buildingId).toBe('string');
      expect(res.body.data.buildingId.length).toBeGreaterThan(0);
      expect(res.body.data.buildingName).toBe(validBuilding.buildingName);
    });

    it('applies schema defaults ([]) when amenities/transportation/preferredSpaces are omitted', async () => {
      const { amenities: _amenities, ...withoutDefaultedFields } = validBuilding;

      const res = await request(app.getHttpServer())
        .post('/buildings')
        .send(withoutDefaultedFields)
        .expect(201);

      expect(res.body.data.amenities).toEqual([]);
      expect(res.body.data.transportation).toEqual([]);
      expect(res.body.data.preferredSpaces).toEqual([]);
    });

    it('rejects an invalid body (bad enum) with 400', async () => {
      await request(app.getHttpServer())
        .post('/buildings')
        .send({ ...validBuilding, leaseType: 'BOGUS_NOT_AN_ENUM' })
        .expect(400);
    });

    it('rejects a wrong-type field with 400', async () => {
      await request(app.getHttpServer())
        .post('/buildings')
        .send({ ...validBuilding, lat: 'not-a-number' })
        .expect(400);
    });
  });

  describe('GET /buildings', () => {
    it('returns { data, total } with total matching data length', async () => {
      const res = await request(app.getHttpServer())
        .get('/buildings')
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.total).toBe(res.body.data.length);
    });

    it('filters by status and leaseType query params', async () => {
      await request(app.getHttpServer())
        .post('/buildings')
        .send({
          ...validBuilding,
          buildingName: 'Managed Active',
          leaseType: 'MANAGED',
          status: 'ACTIVE',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/buildings')
        .send({
          ...validBuilding,
          buildingName: 'Leased Shell',
          leaseType: 'LEASED',
          status: 'SHELL',
        })
        .expect(201);

      const unfiltered = await request(app.getHttpServer())
        .get('/buildings')
        .expect(200);
      expect(unfiltered.body.data.length).toBeGreaterThanOrEqual(2);

      const byStatus = await request(app.getHttpServer())
        .get('/buildings')
        .query({ status: 'ACTIVE' })
        .expect(200);
      expect(
        byStatus.body.data.every(
          (b: { status: string }) => b.status === 'ACTIVE',
        ),
      ).toBe(true);

      const byLeaseType = await request(app.getHttpServer())
        .get('/buildings')
        .query({ leaseType: 'LEASED' })
        .expect(200);
      expect(
        byLeaseType.body.data.every(
          (b: { leaseType: string }) => b.leaseType === 'LEASED',
        ),
      ).toBe(true);
    });

    it('rejects an invalid query value with 400', async () => {
      await request(app.getHttpServer())
        .get('/buildings')
        .query({ status: 'NONSENSE' })
        .expect(400);
    });
  });

  describe('GET /buildings/:id', () => {
    it('returns the created building by id', async () => {
      const created = await request(app.getHttpServer())
        .post('/buildings')
        .send(validBuilding)
        .expect(201);

      const id = created.body.data.buildingId;

      const res = await request(app.getHttpServer())
        .get(`/buildings/${id}`)
        .expect(200);

      expect(res.body.data.buildingId).toBe(id);
      expect(res.body.data.buildingName).toBe(validBuilding.buildingName);
    });

    it('returns 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .get('/buildings/does-not-exist')
        .expect(404);
    });
  });

  describe('PUT /buildings/:id', () => {
    it('updates a building with a partial body and retains other fields', async () => {
      const created = await request(app.getHttpServer())
        .post('/buildings')
        .send(validBuilding)
        .expect(201);

      const id = created.body.data.buildingId;

      const res = await request(app.getHttpServer())
        .put(`/buildings/${id}`)
        .send({ buildingName: 'Renamed Tower' })
        .expect(200);

      expect(res.body.data.buildingName).toBe('Renamed Tower');
      expect(res.body.data.leaseType).toBe(validBuilding.leaseType);
      expect(res.body.data.status).toBe(validBuilding.status);
    });

    it('returns 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .put('/buildings/does-not-exist')
        .send({ buildingName: 'X' })
        .expect(404);
    });
  });
});
