import { Module } from '@nestjs/common';
import { NekretnineModule } from './modules/nekretnine/nekretnine.module';
import { TipNekretnineModule } from './modules/tip-nekretnine/tip-nekretnine.module';
import { AgentiModule } from './modules/agenti/agenti.module';
import { DatabaseModule } from './database/database.module';
import { KontaktZahtjeviModule } from './modules/kontakt-zahtjevi/kontakt-zahtjevi.module';
import { ConfigModule } from '@nestjs/config';
import { KorisnikModule } from './modules/korisnik/korisnik.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    NekretnineModule,
    TipNekretnineModule,
    AgentiModule,
    KontaktZahtjeviModule,
    KorisnikModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
