/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KontaktZahtjeviModule } from './kontakt-zahtjevi.module';
import { KontaktZahtjevi } from './kontakt-zahtjevi.entity';
import { Nekretnine } from '../nekretnine/nekretnine.entity';
import { Korisnik } from '../korisnik/korisnik.entity';
import { Agenti } from '../agenti/agenti.entity';
import { TipNekretnine } from '../tip-nekretnine/tip-nekretnine.entity';
import { Lokacija } from '../lokacija.entity';

describe('KontaktZahtjeviController (Integration)', () => {
  let app: INestApplication;
  let zahtjevId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            KontaktZahtjevi,
            Nekretnine,
            Korisnik,
            Agenti,
            TipNekretnine,
            Lokacija,
          ],
          synchronize: true,
        }),
        KontaktZahtjeviModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/kontakt-zahtjevi (POST)', () => {
    it('should create new kontakt zahtjev', async () => {
      const createData = {
        poruka: 'Zainteresiran sam za ovu nekretninu',
      };

      const response = await request(app.getHttpServer())
        .post('/kontakt-zahtjevi')
        .send(createData)
        .expect(201);

      expect(response.body).toMatchObject(createData);
      expect(response.body.zahtjev_id).toBeDefined();
      zahtjevId = response.body.zahtjev_id;
    });
  });

  describe('/kontakt-zahtjevi/:nekretnina_id (GET)', () => {
    it('should return kontakt zahtjevi by nekretnina ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/kontakt-zahtjevi/1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/kontakt-zahtjevi/:id (PUT)', () => {
    it('should update kontakt zahtjev', async () => {
      const updateData = {
        poruka: 'Još uvijek zainteresiran',
      };

      const response = await request(app.getHttpServer())
        .put(`/kontakt-zahtjevi/${zahtjevId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.zahtjev_id).toBe(zahtjevId);
      expect(response.body.poruka).toBe('Još uvijek zainteresiran');
    });
  });

  describe('/kontakt-zahtjevi/:id (DELETE)', () => {
    it('should delete kontakt zahtjev', async () => {
      await request(app.getHttpServer())
        .delete(`/kontakt-zahtjevi/${zahtjevId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent kontakt zahtjev', async () => {
      await request(app.getHttpServer())
        .delete('/kontakt-zahtjevi/999')
        .expect(404);
    });
  });
});
