import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AcademicDegreeService } from './academicDegree.service';
import { AcademicDegree } from './academicDegree.entity';
import { AcademicDegreeDto } from './dto/academicDegree.dto';

@Controller('academicDegree')
export class AcademicDegreeController {
  constructor(private readonly academicDegreeService: AcademicDegreeService) {}

  @Get()
  public getAll(): Promise<AcademicDegree[]> {
    return this.academicDegreeService.findAll();
  }

  @Post()
  public create(@Body() academicDegreeDto: AcademicDegreeDto) {
    return this.academicDegreeService.create(academicDegreeDto);
  }

  @Put(':id')
  public update(
    @Param('id') id: number,
    @Body() academicDegreeDto: AcademicDegreeDto,
  ) {
    return this.academicDegreeService.update(id, academicDegreeDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.academicDegreeService.delete(id);
  }

}
