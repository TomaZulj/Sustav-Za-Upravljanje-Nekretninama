import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipNekretnine } from './tip-nekretnine.entity';
import { TipNekretnineService } from './tip-nekretnine.service';
import { TipNekretnineController } from './tip-nekretnine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipNekretnine])],
  providers: [TipNekretnineService],
  controllers: [TipNekretnineController],
})
export class TipNekretnineModule {}
