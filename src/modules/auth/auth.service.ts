import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { JwtAdminPayload } from './interfaces/jwt-admin-payload.interface';
import { AdminService } from '../admin/admin.service';
import { AdminLoginDto } from '../admin/dto/admin.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async loginAdmin(adminLoginDto: AdminLoginDto): Promise<object> {
    const admin = await this.adminService.findAdmin(adminLoginDto.username);

    if (!admin) {
      throw new UnauthorizedException('Login failed, invalid user');
    }

    const isPasswordCorrect = await compare(
      adminLoginDto.password,
      admin.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Login Failed - Your email and/or password do not match.');
    }

    const payload: JwtAdminPayload = {
      username: admin.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
