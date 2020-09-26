import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { JwtAdminPayload } from './interfaces/jwt-admin-payload.interface';
import { AdminService } from '../admin/admin.service';
import { UsersService } from '../users/users.service';
import { AdminLoginDto } from '../admin/dto/admin.login.dto';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtUserPayloadInterface } from './interfaces/jwt-user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
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

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { token, password } = signUpDto;
    const { verified, email } = await this.usersService.verifyToken({ token });

    if (verified) {
      throw new Error('User already was verified');
    }

    return this.usersService.signUp({ email, password });
  }

  async login(loginDto: LoginDto): Promise<object> {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Login failed, invalid user');
    }

    const isPasswordCorrect = await compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Login Failed - Your email and/or password do not match.');
    }

    const payload: JwtUserPayloadInterface = {
      email: user.email,
      isActive: user.isActive,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
