import { Body, Controller, Post } from '@nestjs/common';

import { AdminDto } from '../admin/dto/admin.login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login-admin')
  async login(@Body() adminLoginDto: AdminDto): Promise<object> {
    return await this.authService.login(adminLoginDto);
  }
}
