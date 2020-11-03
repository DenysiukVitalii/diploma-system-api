import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards, Res } from '@nestjs/common';

import { CreateProtectionTypeDto } from './dto/create-protectionType.dto';
import { ProtectionService } from './protection.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';
import { CreateProtectionDto } from './dto/create-protection.dto';
import { Protection } from './protection.entity';

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

  @Get('available-students/:protectionTypeId/:groupId')
  public getAvailableStudents(@Param() params) {
    return this.protectionService.getAvailableStudents(params.protectionTypeId, params.groupId);
  }

  @Get()
  public getAllProtections() {
    return this.protectionService.findProtections();
  }

  @Get('group/:groupId')
  public getProtectionsByGroupId(@Param('groupId') groupId) {
    return this.protectionService.findProtectionsByGroupId(groupId);
  }

  @Get('download/:groupId')
  async downloadFileWithProtections(@Res() res, @Param('groupId') groupId): Promise<any> {
    const base64 = await this.protectionService.downloadFileWithProtections(groupId);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessing',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=FileName.docx');

    return res.send(Buffer.from(base64, 'base64'));
  }

  @Post('type')
  createProtectionType(@Body() createProtectionTypeDto: CreateProtectionTypeDto, @CurrentUser() user: User): Promise<object> {
    return this.protectionService.createProtectionType(createProtectionTypeDto, user);
  }

  @Post()
  createProtection(@Body() createProtectionDto: CreateProtectionDto): Promise<object> {
    return this.protectionService.createProtection(createProtectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Protection> {
    return this.protectionService.remove(id);
  }
}
