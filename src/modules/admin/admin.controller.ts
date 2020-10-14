import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin.login.dto';
import { AuthService } from '../auth/auth.service';
import { UsersService } from 'modules/users/users.service';
import { CreateUserDto } from 'modules/users/dto/create-user.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() adminLoginDto: AdminLoginDto): Promise<object> {
    return this.authService.loginAdmin(adminLoginDto);
  }

  @Get('heads')
  getAllHeads() {
    return this.usersService.findAllUsersHeads();
  }

  @Post('create/head')
  createHead(@Body() createHeadDto: CreateUserDto): Promise<object> {
    return this.usersService.createHead(createHeadDto);
  }
}
