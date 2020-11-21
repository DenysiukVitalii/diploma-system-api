import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { TeacherLoadService } from './teacherLoad.service';
import { TeacherLoad } from './teacherLoad.entity';
import { TeacherLoadDto } from './dto/teacherLoad.dto';
import { Roles } from '../users/enums/roles.enum';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { TeacherLoadInterface } from './interfaces';
import { DegreesDto } from './dto/degrees.dto';

@Controller('teacher-load')
export class TeacherLoadController {
  constructor(private readonly teacherLoadService: TeacherLoadService) {}

  @Get()
  public getAll(@CurrentUser() user: User): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadService.findAll(user);
  }

  @Auth(Roles.TEACHER)
  @Get('own')
  public getOwnTeacherLoad(@CurrentUser() user: User): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadService.findByUserId(user.id);
  }

  @Auth(Roles.PERSONAL)
  @Post('download/:academicYear')
  async downloadFileWithLoads(
    @Body() degreesDto: DegreesDto,
    @Param() params,
    @CurrentUser() user: User,
    @Res() res,
  ): Promise<any> {
    const base64 = await this.teacherLoadService.downloadFileWithLoad(user, params.academicYear, degreesDto.degrees);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessing',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=FileName.docx');

    return res.send(Buffer.from(base64, 'base64'));
  }

  @Auth(Roles.PERSONAL)
  @Get(':id')
  public getById(@Param('id') id: number): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadService.findByUserId(id);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  public create(@Body() teacherLoadDto: TeacherLoadDto, @CurrentUser() user: User): Promise<TeacherLoad> {
    return this.teacherLoadService.create(teacherLoadDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public update(@Param('id') id: number, @Body() teacherLoadDto: TeacherLoadDto) {
    return this.teacherLoadService.update(id, teacherLoadDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.teacherLoadService.delete(id);
  }
}
