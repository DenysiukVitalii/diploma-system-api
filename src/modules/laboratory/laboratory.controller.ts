import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { LaboratoryService } from './laboratory.service';
import { Laboratory } from './laboratory.entity';
import { LaboratoryDto } from './dto/laboratory.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Controller('laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Auth(Roles.PERSONAL)
  @Get()
  public getAll(@CurrentUser() user: User): Promise<Laboratory[]> {
    return this.laboratoryService.findAll(user);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  public create(@Body() laboratoryDto: LaboratoryDto, @CurrentUser() user: User) {
    return this.laboratoryService.create(laboratoryDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() laboratoryDto: LaboratoryDto,
  ) {
    return this.laboratoryService.update(id, laboratoryDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public async delete(@Param('id') id: number) {
    return this.laboratoryService.delete(id);
  }
}
