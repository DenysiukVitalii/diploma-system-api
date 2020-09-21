import { Body, Controller, Delete, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { AdminDto } from './dto/admin.login.dto';
// import { AuthService } from '../auth/auth.service';
// import { AdminService } from './admin.service';
// import { JwtAdminPayload } from '../auth/interfaces/jwt-admin-payload.interface';

@Controller('admin')
export class AdminController {
  constructor(
    // private readonly authService: AuthService,
    // private readonly adminService: AdminService,
    // private readonly jwtService: JwtService,
  ) {}

  // @Post('login')
  // async login(@Body() adminLoginDto: AdminDto): Promise<object> {
  //   const admin = await this.adminService.findOne(adminLoginDto.username);
  //   if (!admin) {
  //     throw new UnauthorizedException('Login failed, invalid user');
  //   }
  //
  //   const isPasswordCorrect = await this.authService.validateAdminPassword(
  //     admin.password,
  //     adminLoginDto.password,
  //   );
  //
  //   if (!isPasswordCorrect) {
  //     throw new UnauthorizedException(
  //       'Login Failed - Your email and/or password do not match.',
  //     );
  //   }
  //
  //   const payload: JwtAdminPayload = {
  //     username: admin.username,
  //   };
  //
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

}
