import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

import { LaboratoryDirectionService } from './laboratoryDirection.service';
import { LaboratoryDirection } from './laboratoryDirection.entity';
import { LaboratoryDirectionDto } from './dto/laboratoryDirection.dto';
import { Roles } from 'modules/users/enums/roles.enum';
import { Auth } from 'modules/users/decorators/auth.decorator';

@Auth(Roles.PERSONAL)
@Controller('laboratory-direction')
export class LaboratoryDirectionController {
  constructor(private readonly laboratoryDirectionService: LaboratoryDirectionService) {}

  @Get()
  public getAll(): Promise<LaboratoryDirection[]> {
    return this.laboratoryDirectionService.findAll();
  }

  @Post()
  public create(@Body() laboratoryDirectionDto: LaboratoryDirectionDto) {
    return this.laboratoryDirectionService.create(laboratoryDirectionDto);
  }

  @Put(':id')
  public update(
    @Param('id') id: number,
    @Body() laboratoryDirectionDto: LaboratoryDirectionDto,
  ) {
    return this.laboratoryDirectionService.update(id, laboratoryDirectionDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.laboratoryDirectionService.delete(id);
  }
}
