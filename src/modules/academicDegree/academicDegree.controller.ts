import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AcademicDegreeService } from './academicDegree.service';
import { AcademicDegree } from './academicDegree.entity';
import { AcademicDegreeDto } from './dto/academicDegree.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Controller('academic-degree')
export class AcademicDegreeController {
  constructor(private readonly academicDegreeService: AcademicDegreeService) {}

  @Auth(Roles.PERSONAL)
  @Get()
  public getAll(@CurrentUser() user: User): Promise<AcademicDegree[]> {
    return this.academicDegreeService.findAll(user);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  public create(@Body() academicDegreeDto: AcademicDegreeDto, @CurrentUser() user: User) {
    return this.academicDegreeService.create(academicDegreeDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public update(
    @Param('id') id: number,
    @Body() academicDegreeDto: AcademicDegreeDto,
  ) {
    return this.academicDegreeService.update(id, academicDegreeDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.academicDegreeService.delete(id);
  }
}
