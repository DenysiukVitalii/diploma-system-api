import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { CurrentUser } from 'modules/users/decorators/current-user.decorator';
import { User } from 'modules/users/user.entity';
import { Auth } from 'modules/users/decorators/auth.decorator';
import { Roles } from 'modules/users/enums/roles.enum';

@Auth(Roles.PERSONAL)
@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
  ) {}

  @Get()
  public getAll() {
    return this.groupService.findAll();
  }

  @Get()
  public getById(@Param('id') id) {
    return this.groupService.findById(id);
  }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: User): Promise<object> {
    return this.groupService.create(createGroupDto, user);
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() groupDto: CreateGroupDto) {
    return this.groupService.update(id, groupDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.groupService.delete(id);
  }
}
