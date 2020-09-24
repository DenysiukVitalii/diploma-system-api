import { Body, Controller, Post } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin.login.dto';
import { AuthService } from '../auth/auth.service';
import { CreateHeadDto } from './dto/create.head.dto';
import { UsersService } from 'modules/users/users.service';

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

  @Post('create/head')
  createHead(@Body() createHeadDto: CreateHeadDto): Promise<object> {
    return this.usersService.createHead(createHeadDto);
  }
}
