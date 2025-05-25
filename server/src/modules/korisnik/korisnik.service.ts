import { Injectable } from '@nestjs/common';
import { Korisnik } from './korisnik.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KorisnikService {
  constructor(
    @InjectRepository(Korisnik)
    private readonly korisnikRepository: Repository<Korisnik>,
  ) {}

  async findAll(): Promise<Korisnik[]> {
    return this.korisnikRepository.find();
  }
}
