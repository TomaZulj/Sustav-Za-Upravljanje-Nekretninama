import { Controller, Get } from '@nestjs/common';
import { AgentiService } from './agenti.service';
import { Agenti } from './agenti.entity';

@Controller('agenti')
export class AgentiController {
  constructor(private readonly agentiService: AgentiService) {}

  @Get()
  async findAll(): Promise<Agenti[]> {
    return this.agentiService.findAll();
  }
}
