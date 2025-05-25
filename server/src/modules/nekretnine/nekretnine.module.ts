import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nekretnine } from './nekretnine.entity';
import { NekretnineService } from './nekretnine.service';
import { NekretnineController } from './nekretnine.controller';
import { Lokacija } from '../lokacija.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nekretnine, Lokacija])],
  providers: [NekretnineService],
  controllers: [NekretnineController],
})
export class NekretnineModule {}
