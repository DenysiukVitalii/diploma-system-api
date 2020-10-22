import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './enums/roles.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(Roles.TEACHER)
  @Get('personals')
  getAllPersonals(@CurrentUser('isHead') isHead: boolean) {
    if (!isHead) {
      throw new NotFoundException('User not is head');
    }
    return this.usersService.findAllUsersPersonals();
  }

  @Auth(Roles.TEACHER)
  @Post('personal')
  createPersonal(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser('departmentId') departmentId: number,
    @CurrentUser('isHead') isHead: boolean,
  ): Promise<User> {
    if (!isHead) {
      throw new NotFoundException('User not is head');
    }
    return this.usersService.createPersonal(createUserDto, departmentId);
  }

  @Auth(Roles.TEACHER)
  @Put('personal/:id')
  updatePersonal(
    @Param('id') id: number,
    @CurrentUser('isHead') isHead: boolean,
    @Body() userDto: CreateUserDto,
  ): Promise<object> {
    if (!isHead) {
      throw new NotFoundException('User not is head');
    }
    return this.usersService.updatePersonal(id, userDto);
  }

  @Auth(Roles.TEACHER)
  @Delete('personal/:id')
  public async deletePersonal(
    @Param('id') id: number,
    @CurrentUser('isHead') isHead: boolean,
  ) {
    if (!isHead) {
      throw new NotFoundException('User not is head');
    }
    return this.usersService.deletePersonal(id);
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
  getUser(@CurrentUser() user: User): User {
    return user;
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
