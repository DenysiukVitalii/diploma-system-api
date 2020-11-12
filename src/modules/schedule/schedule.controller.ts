import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards, Res } from '@nestjs/common';

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
  @Get('/:academicYearId/:academicDegreeId')
  public getAll(@CurrentUser() user: User, @Param() params) {
    return this.scheduleService.findAll(user, params);
  }

  @Auth(Roles.PERSONAL)
  @Get('download/:academicYearId/:academicDegreeId')
  async downloadFileWithSchedule(
    @Param() params,
    @CurrentUser() user: User,
    @Res() res,
  ): Promise<void> {
    const base64 = await this.scheduleService.downloadFileWithSchedule(user, params);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessing',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=FileName.docx');

    return res.send(Buffer.from(base64, 'base64'));
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
