import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';

import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { SpecialtyService } from './specialty.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Auth(Roles.PERSONAL)
@Controller('specialty')
export class SpecialtyController {
  constructor(
    private readonly specialtyService: SpecialtyService,
  ) {}

  @Get()
  public getAll() {
    return this.specialtyService.findAll();
  }

  @Get()
  public getById(@Param('id') id) {
    return this.specialtyService.findById(id);
  }

  @Post()
  create(@Body() createSpecialtyDto: CreateSpecialtyDto, @CurrentUser() user: User): Promise<object> {
    return this.specialtyService.create(createSpecialtyDto, user);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() groupDto: CreateSpecialtyDto) {
    return this.specialtyService.update(id, groupDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.specialtyService.delete(id);
  }
}
