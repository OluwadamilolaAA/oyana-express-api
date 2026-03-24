import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OyanaDriverModule } from './../src/oyana-driver.module';

describe('OyanaDriverController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OyanaDriverModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns 404 for the default HTTP route', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});
