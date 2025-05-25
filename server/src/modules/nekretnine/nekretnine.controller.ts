import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { NekretnineService } from './nekretnine.service';
import { Nekretnine } from './nekretnine.entity';

@Controller('nekretnine')
export class NekretnineController {
  constructor(private readonly nekretnineService: NekretnineService) {}

  @Get()
  async findAll(): Promise<Nekretnine[]> {
    return this.nekretnineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Nekretnine> {
    return this.nekretnineService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Nekretnine>): Promise<Nekretnine> {
    return this.nekretnineService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Nekretnine>,
  ): Promise<Nekretnine> {
    return this.nekretnineService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.nekretnineService.delete(id);
  }
}
