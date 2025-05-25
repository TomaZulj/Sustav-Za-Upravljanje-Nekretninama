import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { KontaktZahtjeviService } from './kontakt-zahtjevi.service';
import { KontaktZahtjevi } from './kontakt-zahtjevi.entity';

@Controller('kontakt-zahtjevi')
export class KontaktZahtjeviController {
  constructor(
    private readonly kontaktZahtjeviService: KontaktZahtjeviService,
  ) {}

  @Get(':nekretnina_id')
  async findByNekretninaId(
    @Param('nekretnina_id') nekretnina_id: number,
  ): Promise<KontaktZahtjevi[]> {
    return this.kontaktZahtjeviService.findByNekretninaId(nekretnina_id);
  }

  @Post()
  async create(
    @Body() data: Partial<KontaktZahtjevi>,
  ): Promise<KontaktZahtjevi> {
    return this.kontaktZahtjeviService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<KontaktZahtjevi>,
  ): Promise<KontaktZahtjevi> {
    return this.kontaktZahtjeviService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.kontaktZahtjeviService.delete(id);
  }
}
