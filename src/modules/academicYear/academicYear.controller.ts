import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AcademicYearService } from './academicYear.service';
import { AcademicYear } from './academicYear.entity';
import { AcademicYearDto } from './dto/academicYear.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Auth(Roles.PERSONAL)
@Controller('academic-year')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Get()
  public getAll(): Promise<AcademicYear[]> {
    return this.academicYearService.findAll();
  }

  @Post()
  public create(@Body() academicYearDto: AcademicYearDto, @CurrentUser() user: User) {
    return this.academicYearService.create(academicYearDto, user);
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
