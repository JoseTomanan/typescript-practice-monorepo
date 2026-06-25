import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductsController } from './products.controller';
import { ProductsModule } from '../products.module';

// TODO: review — imports the whole ProductsModule rather than listing
// the use cases + repository tokens as providers directly. Simpler, and
// it exercises the real DI wiring (including ProductsModule ->
// CategoriesModule), but it's a different testing strategy than the
// plan called for, decided on my own.
describe('ProductsController', () => {
  let controller: ProductsController;
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('PATCH /products/:id — ZodValidationPipe', () => {
    const API_KEY = 'ecommerce123';

    it('accepts a partial update (name only) and returns the updated product', async () => {
      const res = await request(app.getHttpServer())
        .patch('/products/1')
        .set('x-api-key', API_KEY)
        .send({ name: 'iPhone 15 Pro' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('iPhone 15 Pro');
    });

    it('accepts an empty body (all fields optional)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/products/1')
        .set('x-api-key', API_KEY)
        .send({});

      expect(res.status).toBe(200);
    });

    it('rejects a negative price with 400', async () => {
      const res = await request(app.getHttpServer())
        .patch('/products/1')
        .set('x-api-key', API_KEY)
        .send({ price: -1 });

      expect(res.status).toBe(400);
    });

    it('rejects a name that is too short with 400', async () => {
      const res = await request(app.getHttpServer())
        .patch('/products/1')
        .set('x-api-key', API_KEY)
        .send({ name: 'x' });

      expect(res.status).toBe(400);
    });

    it('rejects an unknown product with 404', async () => {
      const res = await request(app.getHttpServer())
        .patch('/products/999')
        .set('x-api-key', API_KEY)
        .send({ name: 'Does not matter' });

      expect(res.status).toBe(404);
    });

    it('rejects requests without an API key with 401', async () => {
      const res = await request(app.getHttpServer())
        .patch('/products/1')
        .send({ name: 'iPhone 15 Pro' });

      expect(res.status).toBe(401);
    });
  });
});
