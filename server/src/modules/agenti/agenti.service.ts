import { Injectable, Logger } from '@nestjs/common';
import { Agenti } from './agenti.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AgentiService {
  private readonly logger = new Logger(AgentiService.name);

  constructor(
    @InjectRepository(Agenti)
    private readonly agentiRepository: Repository<Agenti>,
  ) {}

  async findAll(): Promise<Agenti[]> {
    try {
      const agents = await this.agentiRepository.find({
        relations: ['korisnik'],
      });
      return agents;
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw error;
    }
  }
}
