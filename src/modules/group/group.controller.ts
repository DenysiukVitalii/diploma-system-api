import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) {}

  @Auth(Roles.PERSONAL)
  @Get()
  public getAll(@CurrentUser() user: User) {
    return this.groupService.findAll(user);
  }

  @Auth(Roles.PERSONAL)
  @Get()
  public getById(@Param('id') id) {
    return this.groupService.findById(id);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: User): Promise<object> {
    return this.groupService.create(createGroupDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public update(@Param('id') id: number, @Body() groupDto: CreateGroupDto) {
    return this.groupService.update(id, groupDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.groupService.delete(id);
  }
}
