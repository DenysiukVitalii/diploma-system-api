import { Body, Controller, Post } from '@nestjs/common';

import { AdminLoginDto } from '../admin/dto/admin.login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // todo rewrite on user login
  @Post('login-admin')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<object> {
    return await this.authService.loginAdmin(adminLoginDto);
  }
}
