import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { DegreeService } from './degree.service';
import { Degree } from './degree.entity';
import { DegreeDto } from './dto/degree.dto';
import { Roles } from '../users/enums/roles.enum';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';

@Auth(Roles.PERSONAL)
@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Get()
  public getAll(@CurrentUser() user: User): Promise<Degree[]> {
    return this.degreeService.findAll(user);
  }

  @Post()
  public create(@Body() degreeDto: DegreeDto, @CurrentUser() user: User): Promise<Degree> {
    return this.degreeService.create(degreeDto, user);
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
