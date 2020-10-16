import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';
import { CurrentUser } from 'modules/users/decorators/current-user.decorator';
import { User } from 'modules/users/user.entity';
import { Auth } from 'modules/users/decorators/auth.decorator';
import { Roles } from 'modules/users/enums/roles.enum';

@Auth(Roles.PERSONAL)
@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
  ) {}

  @Get()
  public getAll() {
    return this.scheduleService.findAll();
  }

  @Get()
  public getById(@Param('id') id) {
    return this.scheduleService.findById(id);
  }

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @CurrentUser() user: User): Promise<object> {
    return this.scheduleService.create(createScheduleDto, user);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() scheduleDto: CreateScheduleDto) {
    return this.scheduleService.update(id, scheduleDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.scheduleService.delete(id);
  }
}
