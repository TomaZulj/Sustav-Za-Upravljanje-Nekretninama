/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipNekretnineModule } from './tip-nekretnine.module';
import { TipNekretnine } from './tip-nekretnine.entity';

describe('TipNekretnineController (Integration)', () => {
  let app: INestApplication;
  let tipId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TipNekretnine],
          synchronize: true,
        }),
        TipNekretnineModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tip-nekretnine (POST)', () => {
    it('should create new tip nekretnine', async () => {
      const createData = {
        naziv: 'Apartman',
        opis: 'Stambeni objekt u zgradi',
      };

      const response = await request(app.getHttpServer())
        .post('/tip-nekretnine')
        .send(createData)
        .expect(201);

      expect(response.body).toMatchObject(createData);
      expect(response.body.tip_nekretnine_id).toBeDefined();
      tipId = response.body.tip_nekretnine_id;
    });
  });

  describe('/tip-nekretnine (GET)', () => {
    it('should return all tip nekretnine', async () => {
      const response = await request(app.getHttpServer())
        .get('/tip-nekretnine')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('tip_nekretnine_id');
      expect(response.body[0]).toHaveProperty('naziv');
      expect(response.body[0]).toHaveProperty('opis');
    });
  });

  describe('/tip-nekretnine/:id (GET)', () => {
    it('should return single tip nekretnine', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tip-nekretnine/${tipId}`)
        .expect(200);

      expect(response.body.tip_nekretnine_id).toBe(tipId);
      expect(response.body.naziv).toBe('Apartman');
      expect(response.body.opis).toBe('Stambeni objekt u zgradi');
    });

    it('should return 404 for non-existent tip nekretnine', async () => {
      await request(app.getHttpServer()).get('/tip-nekretnine/999').expect(404);
    });
  });

  describe('/tip-nekretnine/:id (PUT)', () => {
    it('should update tip nekretnine', async () => {
      const updateData = {
        naziv: 'Azuriran Apartman',
        opis: 'Azuriran opis',
      };

      const response = await request(app.getHttpServer())
        .put(`/tip-nekretnine/${tipId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.tip_nekretnine_id).toBe(tipId);
      expect(response.body.naziv).toBe('Azuriran Apartman');
      expect(response.body.opis).toBe('Azuriran opis');
    });
  });

  describe('/tip-nekretnine/:id (DELETE)', () => {
    it('should delete tip nekretnine', async () => {
      await request(app.getHttpServer())
        .delete(`/tip-nekretnine/${tipId}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/tip-nekretnine/${tipId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent tip nekretnine', async () => {
      await request(app.getHttpServer())
        .delete('/tip-nekretnine/999')
        .expect(404);
    });
  });
});
