import { Body, Controller, Post } from '@nestjs/common';
import { AdminDto } from './dto/admin.login.dto';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() adminLoginDto: AdminDto): Promise<object> {
    return await this.authService.login(adminLoginDto);
  }
}
