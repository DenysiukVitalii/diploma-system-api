import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { LaboratoryService } from './laboratory.service';
import { Laboratory } from './laboratory.entity';
import { LaboratoryDto } from './dto/laboratory.dto';

@Controller('laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Get()
  public getAll(): Promise<Laboratory[]> {
    return this.laboratoryService.findAll();
  }

  @Post()
  public create(@Body() laboratoryDto: LaboratoryDto) {
    return this.laboratoryService.create(laboratoryDto);
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() laboratoryDto: LaboratoryDto,
  ) {
    return this.laboratoryService.update(id, laboratoryDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: number) {
    return this.laboratoryService.delete(id);
  }

}
