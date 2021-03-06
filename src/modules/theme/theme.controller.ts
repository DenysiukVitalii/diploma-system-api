import { Body, Controller, Param, Get, Post, Put, Delete, Query, Response, Header, Res } from '@nestjs/common';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';
import { CreateThemeDto } from './dto/create-theme.dto';
import { ThemeService } from './theme.service';

@Auth(Roles.TEACHER)
@Controller('theme')
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
  ) {}

  @Get()
  public getAll(@CurrentUser() user: User) {
    return this.themeService.findAll(user);
  }

  @Auth(Roles.TEACHER)
  @Put(':id/approve')
  public approve(@Param('id') id: number) {
    return this.themeService.setConfirmed(id, true);
  }

  @Auth(Roles.TEACHER)
  @Put(':id/decline')
  public decline(@Param('id') id: number) {
    return this.themeService.setConfirmed(id, false);
  }

  @Auth(Roles.TEACHER)
  @Get('my')
  getMyThemes(@CurrentUser() user: User): Promise<object> {
    return this.themeService.getMyThemes(user);
  }

  @Auth(Roles.STUDENT)
  @Get('student')
  getThemesForStudent(@CurrentUser() user: User): Promise<object> {
    return this.themeService.getThemesForStudent(user);
  }

  @Auth(Roles.STUDENT)
  @Get('student/my')
  getStudentTheme(@CurrentUser() user: User): Promise<object> {
    return this.themeService.getStudentTheme(user);
  }

  @Auth(Roles.TEACHER)
  @Delete(':themeId/student')
  public deleteStudentFromTheme(@Param('themeId') themeId: number, @CurrentUser() user: User) {
    return this.themeService.deleteStudentFromTheme(themeId, user);
  }

  @Auth(Roles.PERSONAL)
  @Get('download/:academicYear/:academicDegree')
  async downloadFileWithThemes(@Res() res, @Param() params, @CurrentUser() user: User): Promise<any> {
    const base64 = await this.themeService.downloadFileWithThemes(user, params.academicYear, params.academicDegree);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessing',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=FileName.docx');

    return res.send(Buffer.from(base64, 'base64'));
  }

  @Get()
  public getById(@Param('id') id) {
    return this.themeService.findById(id);
  }

  @Auth(Roles.TEACHER)
  @Post()
  create(@Body() creatThemeDto: CreateThemeDto, @CurrentUser() user: User): Promise<object> {
    return this.themeService.create(creatThemeDto, user);
  }

  @Auth(Roles.TEACHER)
  @Put(':id')
  public update(@Param('id') id: number, @Body() themeDto: CreateThemeDto) {
    return this.themeService.update(id, themeDto);
  }

  @Auth(Roles.TEACHER, Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.themeService.delete(id);
  }
}
