import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Nekretnine } from '../modules/nekretnine/nekretnine.entity';
import { TipNekretnine } from '../modules/tip-nekretnine/tip-nekretnine.entity';
import { Agenti } from '../modules/agenti/agenti.entity';
import { Korisnik } from '../modules/korisnik/korisnik.entity';
import { Lokacija } from '../modules/lokacija.entity';
import { KontaktZahtjevi } from '../modules/kontakt-zahtjevi/kontakt-zahtjevi.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Nekretnine,
          TipNekretnine,
          Agenti,
          Korisnik,
          Lokacija,
          KontaktZahtjevi,
        ],
      }),
    }),
  ],
})
export class DatabaseModule {}
