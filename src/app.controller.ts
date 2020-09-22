import { Get, Controller, UseGuards, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAdminAuthGuard } from './auth/guards/jwt-admin-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Get()
  root(): string {
    return this.appService.root();
  }
}
