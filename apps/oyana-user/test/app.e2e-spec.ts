import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OyanaUserModule } from './../src/oyana-user.module';

describe('OyanaUserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OyanaUserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns 404 for the default HTTP route', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});
