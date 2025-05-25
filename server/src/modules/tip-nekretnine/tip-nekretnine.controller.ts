import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TipNekretnineService } from './tip-nekretnine.service';
import { TipNekretnine } from './tip-nekretnine.entity';

@Controller('tip-nekretnine')
export class TipNekretnineController {
  constructor(private readonly tipNekretnineService: TipNekretnineService) {}

  @Get()
  async findAll(): Promise<TipNekretnine[]> {
    return this.tipNekretnineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TipNekretnine> {
    return this.tipNekretnineService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<TipNekretnine>): Promise<TipNekretnine> {
    return this.tipNekretnineService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<TipNekretnine>,
  ): Promise<TipNekretnine> {
    return this.tipNekretnineService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.tipNekretnineService.delete(id);
  }
}
