import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';

import { CurrentUser } from 'modules/users/decorators/current-user.decorator';
import { User } from 'modules/users/user.entity';
import { Auth } from 'modules/users/decorators/auth.decorator';
import { Roles } from 'modules/users/enums/roles.enum';
import { CreateThemeDto } from './dto/create-theme.dto';
import { ThemeService } from './theme.service';

@Auth(Roles.TEACHER)
@Controller('theme')
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
  ) {}

  @Get()
  public getAll() {
    return this.themeService.findAll();
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

  @Auth(Roles.TEACHER)
  @Delete(':themeId/student')
  public deleteStudentFromTheme(@Param('themeId') themeId: number) {
    return this.themeService.deleteStudentFromTheme(themeId);
  }

  @Get()
  public getById(@Param('id') id) {
    return this.themeService.findById(id);
  }

  @Post()
  create(@Body() creatThemeDto: CreateThemeDto, @CurrentUser() user: User): Promise<object> {
    return this.themeService.create(creatThemeDto, user);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() themeDto: CreateThemeDto) {
    return this.themeService.update(id, themeDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.themeService.delete(id);
  }
}
