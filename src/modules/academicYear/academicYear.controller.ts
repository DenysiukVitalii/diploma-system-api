import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AcademicYearService } from './academicYear.service';
import { AcademicYear } from './academicYear.entity';
import { AcademicYearDto } from './dto/academicYear.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Controller('academic-year')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Auth(Roles.PERSONAL)
  @Get()
  public getAll(@CurrentUser() user: User): Promise<AcademicYear[]> {
    return this.academicYearService.findAll(user);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  public create(@Body() academicYearDto: AcademicYearDto, @CurrentUser() user: User) {
    return this.academicYearService.create(academicYearDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public update(
    @Param('id') id: number,
    @Body() academicYearDto: AcademicYearDto,
  ) {
    return this.academicYearService.update(id, academicYearDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.academicYearService.delete(id);
  }
}
