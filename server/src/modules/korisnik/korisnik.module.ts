import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Korisnik } from './korisnik.entity';
import { KorisnikController } from './korisnik.controller';
import { KorisnikService } from './korisnik.service';

@Module({
  imports: [TypeOrmModule.forFeature([Korisnik])],
  providers: [KorisnikService],
  controllers: [KorisnikController],
  exports: [TypeOrmModule],
})
export class KorisnikModule {}
