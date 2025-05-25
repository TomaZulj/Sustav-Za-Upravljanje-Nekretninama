import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KontaktZahtjevi } from './kontakt-zahtjevi.entity';

@Injectable()
export class KontaktZahtjeviService {
  constructor(
    @InjectRepository(KontaktZahtjevi)
    private readonly kontaktZahtjeviRepository: Repository<KontaktZahtjevi>,
  ) {}

  async findByNekretninaId(nekretnina_id: number): Promise<KontaktZahtjevi[]> {
    return this.kontaktZahtjeviRepository.find({
      where: { nekretnina: { nekretnina_id } },
      relations: ['nekretnina', 'korisnik', 'agent'],
    });
  }

  async findOne(zahtjev_id: number): Promise<KontaktZahtjevi> {
    const tip = await this.kontaktZahtjeviRepository.findOneBy({
      zahtjev_id,
    });
    if (!tip) {
      throw new NotFoundException(
        `Tip nekretnine sa ID ${zahtjev_id} nije pronađen`,
      );
    }
    return tip;
  }

  async create(data: Partial<KontaktZahtjevi>): Promise<KontaktZahtjevi> {
    const newKontaktZahtjev = this.kontaktZahtjeviRepository.create(data);
    return this.kontaktZahtjeviRepository.save(newKontaktZahtjev);
  }

  async update(
    zahtjev_id: number,
    data: Partial<KontaktZahtjevi>,
  ): Promise<KontaktZahtjevi> {
    await this.kontaktZahtjeviRepository.update(zahtjev_id, data);
    return this.findOne(zahtjev_id);
  }

  async delete(tip_nekretnine_id: number): Promise<void> {
    const result =
      await this.kontaktZahtjeviRepository.delete(tip_nekretnine_id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Tip nekretnine sa ID ${tip_nekretnine_id} nije pronađen`,
      );
    }
  }
}
