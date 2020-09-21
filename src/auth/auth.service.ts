import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtAdminPayload } from './interfaces/jwt-admin-payload.interface';
import { AdminService } from '../admin/admin.service';
import { AdminDto } from '../admin/dto/admin.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  validateAdminPassword(passwordHash: string, pass: string): boolean {
    return passwordHash === pass;
  }

  async login(adminLoginDto: AdminDto): Promise<object> {
    Logger.log('start');

    const admin = await this.adminService.findOne(adminLoginDto.username);
    // const admin = {
    //   password: '1',
    //   username: '1',
    // };
    Logger.log(admin);
    if (!admin) {
      throw new UnauthorizedException('Login failed, invalid user');
    }

    const isPasswordCorrect = this.validateAdminPassword(
      admin.password,
      adminLoginDto.password,
    );
    Logger.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        'Login Failed - Your email and/or password do not match.',
      );
    }

    const payload: JwtAdminPayload = {
      username: admin.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  // async loginAdmin(payload: AdminDto) {
  //   const admin = await this.usersService.findOne(payload);
  //   if (admin && admin.password === password) {
  //     return admin;
  //   }
  //   const payload = {
  //     username: admin.username,
  //     password: admin.password
  //   };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
