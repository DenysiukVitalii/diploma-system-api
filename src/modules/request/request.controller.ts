import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';

import { CurrentUser } from 'modules/users/decorators/current-user.decorator';
import { User } from 'modules/users/user.entity';
import { Auth } from 'modules/users/decorators/auth.decorator';
import { Roles } from 'modules/users/enums/roles.enum';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestService } from './request.service';
import { ActionRequestDto } from './dto/action-request.dto';

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
  ) {}

  @Auth(Roles.TEACHER, Roles.STUDENT)
  @Get()
  public getAll() {
    return this.requestService.findAll();
  }

  @Auth(Roles.TEACHER, Roles.STUDENT)
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
  public update(@Param('id') id: number, @Body() requestDto: ActionRequestDto) {
    return this.requestService.update(id, requestDto);
  }

  @Auth(Roles.TEACHER, Roles.STUDENT)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.requestService.delete(id);
  }
}
