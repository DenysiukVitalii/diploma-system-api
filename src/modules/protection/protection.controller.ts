import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { CreateProtectionTypeDto } from './dto/create-protectionType.dto';
import { ProtectionService } from './protection.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';
import { CreateProtectionDto } from './dto/create-protection.dto';

@Auth(Roles.PERSONAL)
@Controller('protection')
export class ProtectionController {
  constructor(
    private readonly protectionService: ProtectionService,
  ) {}

  @Get('/types')
  public getAllProtectionTypes() {
    return this.protectionService.findAllProtectionTypes();
  }

  @Get()
  public getAllProtections() {
    return this.protectionService.findAllProtections();
  }

  @Post()
  createProtectionType(@Body() createProtectionTypeDto: CreateProtectionTypeDto, @CurrentUser() user: User): Promise<object> {
    return this.protectionService.createProtectionType(createProtectionTypeDto, user);
  }

  @Post()
  createProtection(@Body() createProtectionDto: CreateProtectionDto): Promise<object> {
    return this.protectionService.createProtection(createProtectionDto);
  }
}
