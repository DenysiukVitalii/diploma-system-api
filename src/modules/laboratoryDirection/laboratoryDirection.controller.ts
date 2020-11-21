import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { LaboratoryDirectionService } from './laboratoryDirection.service';
import { LaboratoryDirection } from './laboratoryDirection.entity';
import { LaboratoryDirectionDto } from './dto/laboratoryDirection.dto';
import { Roles } from '../users/enums/roles.enum';
import { Auth } from '../users/decorators/auth.decorator';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('laboratory-direction')
export class LaboratoryDirectionController {
  constructor(private readonly laboratoryDirectionService: LaboratoryDirectionService) {}

  @Auth(Roles.PERSONAL)
  @Get()
  public getAll(@CurrentUser() user: User): Promise<LaboratoryDirection[]> {
    return this.laboratoryDirectionService.findAll(user);
  }

  @Auth(Roles.PERSONAL)
  @Post()
  public create(@Body() laboratoryDirectionDto: LaboratoryDirectionDto, @CurrentUser() user: User) {
    return this.laboratoryDirectionService.create(laboratoryDirectionDto, user);
  }

  @Auth(Roles.PERSONAL)
  @Put(':id')
  public update(
    @Param('id') id: number,
    @Body() laboratoryDirectionDto: LaboratoryDirectionDto,
  ) {
    return this.laboratoryDirectionService.update(id, laboratoryDirectionDto);
  }

  @Auth(Roles.PERSONAL)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.laboratoryDirectionService.delete(id);
  }
}
