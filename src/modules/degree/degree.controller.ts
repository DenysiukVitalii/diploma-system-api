import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { DegreeService } from './degree.service';
import { Degree } from './degree.entity';
import { DegreeDto } from './dto/degree.dto';

@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Get()
  public getAll(): Promise<Degree[]> {
    return this.degreeService.findAll();
  }

  @Post()
  public create(@Body() degreeDto: DegreeDto) {
    return this.degreeService.create(degreeDto);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() degreeDto: DegreeDto) {
    return this.degreeService.update(id, degreeDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.degreeService.delete(id);
  }
}
