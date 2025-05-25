import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KontaktZahtjevi } from './kontakt-zahtjevi.entity';
import { KontaktZahtjeviService } from './kontakt-zahtjevi.service';
import { KontaktZahtjeviController } from './kontakt-zahtjevi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KontaktZahtjevi])],
  providers: [KontaktZahtjeviService],
  controllers: [KontaktZahtjeviController],
})
export class KontaktZahtjeviModule {}
