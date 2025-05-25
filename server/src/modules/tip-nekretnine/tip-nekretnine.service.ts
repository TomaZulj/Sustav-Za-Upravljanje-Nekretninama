import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipNekretnine } from './tip-nekretnine.entity';

@Injectable()
export class TipNekretnineService {
  constructor(
    @InjectRepository(TipNekretnine)
    private readonly tipNekretnineRepository: Repository<TipNekretnine>,
  ) {}

  async findAll(): Promise<TipNekretnine[]> {
    return this.tipNekretnineRepository.find();
  }

  async findOne(tip_nekretnine_id: number): Promise<TipNekretnine> {
    const tip = await this.tipNekretnineRepository.findOneBy({
      tip_nekretnine_id,
    });
    if (!tip) {
      throw new NotFoundException(
        `Tip nekretnine sa ID ${tip_nekretnine_id} nije pronađen`,
      );
    }
    return tip;
  }

  async create(data: Partial<TipNekretnine>): Promise<TipNekretnine> {
    const tip = this.tipNekretnineRepository.create(data);
    return this.tipNekretnineRepository.save(tip);
  }

  async update(
    tip_nekretnine_id: number,
    data: Partial<TipNekretnine>,
  ): Promise<TipNekretnine> {
    await this.tipNekretnineRepository.update(tip_nekretnine_id, data);
    return this.findOne(tip_nekretnine_id);
  }

  async delete(tip_nekretnine_id: number): Promise<void> {
    const result = await this.tipNekretnineRepository.delete(tip_nekretnine_id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Tip nekretnine sa ID ${tip_nekretnine_id} nije pronađen`,
      );
    }
  }
}
