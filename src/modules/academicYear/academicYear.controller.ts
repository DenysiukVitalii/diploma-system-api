import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AcademicYearService } from './academicYear.service';
import { AcademicYear } from './academicYear.entity';
import { AcademicYearDto } from './dto/academicYear.dto';

@Controller('academic-year')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Get()
  public getAll(): Promise<AcademicYear[]> {
    return this.academicYearService.findAll();
  }

  @Post()
  public create(@Body() academicYearDto: AcademicYearDto) {
    return this.academicYearService.create(academicYearDto);
  }

  @Put(':id')
  public update(
    @Param('id') id: number,
    @Body() academicYearDto: AcademicYearDto,
  ) {
    return this.academicYearService.update(id, academicYearDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.academicYearService.delete(id);
  }
}
