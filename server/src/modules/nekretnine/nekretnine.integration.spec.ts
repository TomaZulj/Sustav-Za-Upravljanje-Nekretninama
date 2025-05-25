/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NekretnineModule } from './nekretnine.module';
import { Nekretnine } from './nekretnine.entity';
import { Lokacija } from '../lokacija.entity';
import { TipNekretnine } from '../tip-nekretnine/tip-nekretnine.entity';
import { Agenti } from '../agenti/agenti.entity';
import { Korisnik } from '../korisnik/korisnik.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('NekretnineController (Integration)', () => {
  let app: INestApplication;
  let nekretninaId: number;
  let tipNekretnineId: number;
  let agentId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Nekretnine, Lokacija, TipNekretnine, Agenti, Korisnik],
          synchronize: true,
        }),
        NekretnineModule,
        TypeOrmModule.forFeature([Korisnik, TipNekretnine, Agenti]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const korisnikRepo = moduleFixture.get<Repository<Korisnik>>(
      getRepositoryToken(Korisnik),
    );
    const tipRepo = moduleFixture.get<Repository<TipNekretnine>>(
      getRepositoryToken(TipNekretnine),
    );
    const agentRepo = moduleFixture.get<Repository<Agenti>>(
      getRepositoryToken(Agenti),
    );

    const korisnik = korisnikRepo.create({
      email: 'agent@test.com',
      lozinka: 'password123',
      ime: 'Marko',
      prezime: 'Petrović',
    });
    const savedKorisnik = await korisnikRepo.save(korisnik);

    const tipNekretnine = tipRepo.create({
      naziv: 'Apartman',
      opis: 'Stambeni objekt',
    });
    const savedTip = await tipRepo.save(tipNekretnine);
    tipNekretnineId = savedTip.tip_nekretnine_id;

    const agent = agentRepo.create({
      datum_zaposlenja: new Date(),
      korisnik: savedKorisnik,
    });
    const savedAgent = await agentRepo.save(agent);
    agentId = savedAgent.agent_id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/nekretnine (POST)', () => {
    it('should create new nekretnina', async () => {
      const createData = {
        naslov: 'Lijep apartman u centru',
        opis: 'Moderan apartman sa prelijepim pogledom',
        cijena: 120000,
        povrsina: 65,
        status: 'dostupan',
        lokacija: {
          adresa: 'Glavni trg 5',
          grad: 'Zagreb',
          drzava: 'Hrvatska',
        },
        tipNekretnine: { tip_nekretnine_id: tipNekretnineId },
        agent: { agent_id: agentId },
      };

      const response = await request(app.getHttpServer())
        .post('/nekretnine')
        .send(createData)
        .expect(201);

      expect(response.body.naslov).toBe(createData.naslov);
      expect(response.body.opis).toBe(createData.opis);
      expect(response.body.cijena).toBe(createData.cijena);
      expect(response.body.povrsina).toBe(createData.povrsina);
      expect(response.body.status).toBe(createData.status);
      expect(response.body.nekretnina_id).toBeDefined();
      nekretninaId = response.body.nekretnina_id;
    });
  });

  describe('/nekretnine (GET)', () => {
    it('should return all nekretnine', async () => {
      const response = await request(app.getHttpServer())
        .get('/nekretnine')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('nekretnina_id');
      expect(response.body[0]).toHaveProperty('naslov');
      expect(response.body[0]).toHaveProperty('cijena');
    });
  });

  describe('/nekretnine/:id (GET)', () => {
    it('should return single nekretnina', async () => {
      const response = await request(app.getHttpServer())
        .get(`/nekretnine/${nekretninaId}`)
        .expect(200);

      expect(response.body.nekretnina_id).toBe(nekretninaId);
      expect(response.body.naslov).toBe('Lijep apartman u centru');
      expect(response.body.cijena).toBe(120000);
    });

    it('should return 404 for non-existent nekretnina', async () => {
      await request(app.getHttpServer()).get('/nekretnine/999').expect(500);
    });
  });

  describe('/nekretnine/:id (PUT)', () => {
    it('should update nekretnina', async () => {
      const updateData = {
        naslov: 'Odlican apartman u centru',
        cijena: 135000,
      };

      const response = await request(app.getHttpServer())
        .put(`/nekretnine/${nekretninaId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nekretnina_id).toBe(nekretninaId);
      expect(response.body.naslov).toBe('Odlican apartman u centru');
      expect(response.body.cijena).toBe(135000);
    });
  });

  describe('/nekretnine/:id (DELETE)', () => {
    it('should delete nekretnina', async () => {
      await request(app.getHttpServer())
        .delete(`/nekretnine/${nekretninaId}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/nekretnine/${nekretninaId}`)
        .expect(500);
    });
  });
});
