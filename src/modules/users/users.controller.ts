import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(Roles.HEAD_OF_DEPARTMENT)
  @Post('create/personal')
  createPersonal(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createPersonal(createUserDto);
  }

  @Auth(Roles.PERSONAL)
  @Post('create/teacher')
  createTeacher(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createTeacher(createUserDto);
  }

  @Auth(Roles.PERSONAL)
  @Post('create/student')
  createStudent(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createStudent(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
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
