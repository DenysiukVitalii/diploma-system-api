import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AdminService } from '../../admin/admin.service';
import { jwtConstants } from '../constants';
import { JwtAdminPayload } from '../interfaces/jwt-admin-payload.interface';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtAdminPayload): Promise<any> {
    const admin = await this.adminService.findAdmin(payload.username);
    if (!admin) {
      throw new UnauthorizedException('');
    }
    return admin;
  }
}
