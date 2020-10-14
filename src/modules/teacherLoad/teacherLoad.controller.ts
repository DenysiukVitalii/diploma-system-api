import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { TeacherLoadService } from './teacherLoad.service';
import { TeacherLoad } from './teacherLoad.entity';
import { TeacherLoadDto } from './dto/teacherLoad.dto';
import { Roles } from '../users/enums/roles.enum';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { TeacherLoadInterface } from './interfaces';

@Auth(Roles.PERSONAL)
@Controller('teacherLoad')
export class TeacherLoadController {
  constructor(private readonly teacherLoadService: TeacherLoadService) {}

  @Get()
  public getAll(): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadService.findAll();
  }

  @Get(':id')
  public getById(@Param('id') id: number): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadService.findByUserId(id);
  }

  @Post()
  public create(@Body() teacherLoadDto: TeacherLoadDto, @CurrentUser() user: User): Promise<TeacherLoad> {
    return this.teacherLoadService.create(teacherLoadDto, user);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() teacherLoadDto: TeacherLoadDto) {
    return this.teacherLoadService.update(id, teacherLoadDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.teacherLoadService.delete(id);
  }
}
