import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './enums/roles.enum';
import { IsHeadGuard } from 'modules/auth/guards/isHead.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(Roles.TEACHER)
  @UseGuards(IsHeadGuard)
  @Post('create/personal')
  createPersonal(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createPersonal(createUserDto);
  }

  @Auth(Roles.PERSONAL)
  @Get('teachers')
  getAllTeachers() {
    return this.usersService.findAllUsersTeachers();
  }

  @Auth(Roles.PERSONAL)
  @Post('teacher')
  createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
    @CurrentUser('departmentId') departmentId: number,
  ): Promise<object> {
    return this.usersService.createTeacher(createTeacherDto, departmentId);
  }

  @Auth(Roles.PERSONAL)
  @Put('teacher/:id')
  updateTeacher(@Param('id') id: number, @Body() teacherDto: CreateTeacherDto): Promise<object> {
    return this.usersService.updateTeacher(id, teacherDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete('teacher/:id')
  public async deleteTeacher(@Param('id') id: number) {
    return this.usersService.deleteTeacher(id);
  }

  @Auth(Roles.PERSONAL)
  @Get('students')
  getAllStudents(@Query() query: object) {
    return this.usersService.findAllUsersStudents(query);
  }

  @Auth(Roles.PERSONAL)
  @Post('student')
  createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser('departmentId') departmentId: number,
  ): Promise<object> {
    return this.usersService.createStudent(createStudentDto, departmentId);
  }

  @Auth(Roles.PERSONAL)
  @Put('student/:id')
  updateStudent(@Param('id') id: number, @Body() studentDto: CreateStudentDto): Promise<object> {
    return this.usersService.updateStudent(id, studentDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete('student/:id')
  public async deleteStudent(@Param('id') id: number) {
    return this.usersService.deleteStudent(id);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Auth(Roles.PERSONAL, Roles.TEACHER, Roles.STUDENT)
  @Get('current')
  getUser(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findCurrentUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
