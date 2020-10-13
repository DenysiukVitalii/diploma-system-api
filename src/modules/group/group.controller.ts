import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';

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
  async create(@Body() createGroupDto: CreateGroupDto): Promise<object> {
    return this.groupService.create(createGroupDto);
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