import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nekretnine } from './nekretnine.entity';
import { Lokacija } from '../lokacija.entity';

@Injectable()
export class NekretnineService {
  constructor(
    @InjectRepository(Nekretnine)
    private readonly nekretnineRepository: Repository<Nekretnine>,
    @InjectRepository(Lokacija)
    private readonly lokacijaRepository: Repository<Lokacija>,
  ) {}

  async findAll(): Promise<Nekretnine[]> {
    return this.nekretnineRepository.find();
  }

  async findOne(nekretnina_id: number): Promise<Nekretnine> {
    const nekretnina = await this.nekretnineRepository.findOneBy({
      nekretnina_id,
    });
    if (!nekretnina) {
      throw new Error(`Nekretnina sa ID ${nekretnina_id} nije pronađena`);
    }
    return nekretnina;
  }

  async create(data: Partial<Nekretnine>): Promise<Nekretnine> {
    if (
      data.lokacija &&
      data.lokacija.adresa &&
      data.lokacija.grad &&
      data.lokacija.drzava
    ) {
      const lokacija = this.lokacijaRepository.create(data.lokacija);
      const savedLokacija = await this.lokacijaRepository.save(lokacija);
      data.lokacija = savedLokacija;
    }

    if (!data.tipNekretnine || !data.tipNekretnine.tip_nekretnine_id) {
      throw new Error('Tip nekretnine je obavezan.');
    }

    if (!data.agent || !data.agent.agent_id) {
      throw new Error('Agent je obavezan.');
    }

    const nekretnina = this.nekretnineRepository.create(data);
    return this.nekretnineRepository.save(nekretnina);
  }

  async update(
    nekretnina_id: number,
    data: Partial<Nekretnine>,
  ): Promise<Nekretnine> {
    if (data.lokacija && data.lokacija.lokacija_id) {
      const lokacijaId = data.lokacija.lokacija_id;
      const lokacijaData = data.lokacija;

      delete lokacijaData.lokacija_id;

      await this.lokacijaRepository.update(lokacijaId, lokacijaData);
    }

    delete data.lokacija;

    await this.nekretnineRepository.update(nekretnina_id, data);

    return this.findOne(nekretnina_id);
  }

  async delete(nekretnina_id: number): Promise<void> {
    await this.nekretnineRepository.delete(nekretnina_id);
  }
}
