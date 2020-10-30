import { Body, Controller, Post } from '@nestjs/common';

import { AdminLoginDto } from '../admin/dto/admin.login.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { VerifyTokenDto } from './dto/verify.token.dto';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { RecoverPasswordDto } from '../users/dto/recover-password.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // todo rewrite on user login
  @Post('login-admin')
  loginAdmin(@Body() adminLoginDto: AdminLoginDto): Promise<object> {
    return this.authService.loginAdmin(adminLoginDto);
  }

  @Post('verify')
  verify(@Body() verifyTokenDto: VerifyTokenDto): Promise<any> {
    return this.usersService.verifyToken(verifyTokenDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<object> {
    return this.authService.login(loginDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordData: ResetPasswordDto): Promise<object> {
    return this.usersService.resetPassword(resetPasswordData);
  }

  @Post('recover-password')
  recoverPassword(@Body() recoverPasswordData: RecoverPasswordDto): Promise<object> {
    return this.usersService.recoverPassword(recoverPasswordData);
  }

  @Auth(Roles.PERSONAL, Roles.TEACHER, Roles.STUDENT)
  @Post('change-password')
  changePassword(@Body() changePasswordData: ChangePasswordDto, @CurrentUser('email') email: string): Promise<object> {
    return this.usersService.changePassword(changePasswordData, email);
  }
}
