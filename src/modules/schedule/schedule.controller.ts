import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
  ) {}

  @Auth(Roles.PERSONAL, Roles.STUDENT, Roles.TEACHER)
  @Get()
  public getAll() {
    return this.scheduleService.findAll();
  }

  @Auth(Roles.PERSONAL)
  @Get()
  public getById(@Param('id') id) {
    return this.scheduleService.findById(id);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @CurrentUser() user: User): Promise<object> {
    return this.scheduleService.create(createScheduleDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public update(@Param('id') id: number, @Body() scheduleDto: CreateScheduleDto) {
    return this.scheduleService.update(id, scheduleDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.scheduleService.delete(id);
  }
}
