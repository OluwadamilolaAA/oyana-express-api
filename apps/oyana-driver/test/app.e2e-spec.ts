import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { OyanaDriverModule } from './../src/oyana-driver.module';

describe('OyanaDriverController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OyanaDriverModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns 404 for the default HTTP route', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});
