import { Controller, Get } from '@nestjs/common';
import { Korisnik } from './korisnik.entity';
import { KorisnikService } from './korisnik.service';

@Controller('korisnici')
export class KorisnikController {
  constructor(private readonly korisnikService: KorisnikService) {}

  @Get()
  async findAll(): Promise<Korisnik[]> {
    return this.korisnikService.findAll();
  }
}
