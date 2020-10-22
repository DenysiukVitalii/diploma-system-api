import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';

import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Auth } from '../users/decorators/auth.decorator';
import { Roles } from '../users/enums/roles.enum';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestService } from './request.service';
import { ActionRequestDto } from './dto/action-request.dto';

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
  ) {}

  @Auth(Roles.STUDENT)
  @Get()
  public getAll(@CurrentUser() user: User) {
    return this.requestService.findAll(user);
  }

  @Auth(Roles.STUDENT)
  @Get()
  public getById(@Param('id') id) {
    return this.requestService.findById(id);
  }

  @Auth(Roles.STUDENT)
  @Post()
  create(@Body() creatThemeDto: CreateRequestDto, @CurrentUser() user: User): Promise<object> {
    return this.requestService.create(creatThemeDto, user);
  }

  @Auth(Roles.TEACHER)
  @Put(':id')
  public update(@Param('id') id: number, @Body() requestDto: ActionRequestDto, @CurrentUser() user: User) {
    return this.requestService.update(id, requestDto, user);
  }

  @Auth(Roles.TEACHER, Roles.STUDENT)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.requestService.delete(id);
  }
}
