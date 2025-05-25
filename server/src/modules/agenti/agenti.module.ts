import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentiController } from './agenti.controller';
import { AgentiService } from './agenti.service';
import { Agenti } from './agenti.entity';
import { Korisnik } from '../korisnik/korisnik.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agenti, Korisnik])],
  controllers: [AgentiController],
  providers: [AgentiService],
  exports: [AgentiService],
})
export class AgentiModule {}
