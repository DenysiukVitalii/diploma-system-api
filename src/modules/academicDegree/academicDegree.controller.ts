import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { AcademicDegreeService } from './academicDegree.service';
import { AcademicDegree } from './academicDegree.entity';
import { AcademicDegreeDto } from './dto/academicDegree.dto';
import { CurrentUser } from 'modules/users/decorators/current-user.decorator';
import { User } from 'modules/users/user.entity';
import { Auth } from 'modules/users/decorators/auth.decorator';
import { Roles } from 'modules/users/enums/roles.enum';

@Auth(Roles.PERSONAL)
@Controller('academic-degree')
export class AcademicDegreeController {
  constructor(private readonly academicDegreeService: AcademicDegreeService) {}

  @Get()
  public getAll(): Promise<AcademicDegree[]> {
    return this.academicDegreeService.findAll();
  }

  @Post()
  public create(@Body() academicDegreeDto: AcademicDegreeDto, @CurrentUser() user: User) {
    return this.academicDegreeService.create(academicDegreeDto, user);
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
