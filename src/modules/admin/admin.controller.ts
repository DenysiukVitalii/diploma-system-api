import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { AdminLoginDto } from './dto/admin.login.dto';
import { AuthService } from '../auth/auth.service';
import { UsersService } from 'modules/users/users.service';
import { CreateHeadDto } from './dto/create.head.dto';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';

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

  @UseGuards(JwtAdminAuthGuard)
  @Get('heads')
  getAllHeads() {
    return this.usersService.findAllUsersHeads();
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('head')
  createHead(@Body() createHeadDto: CreateHeadDto): Promise<object> {
    return this.usersService.createHead(createHeadDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Put('head/:id')
  updateHead(@Param('id') id: number, @Body() headDto: CreateHeadDto): Promise<object> {
    return this.usersService.updateHead(id, headDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Delete('head/:id')
  public async delete(@Param('id') id: number) {
    return this.usersService.deleteHead(id);
  }
}
