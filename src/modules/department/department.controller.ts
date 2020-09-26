import { Body, Controller, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';

import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentService } from './department.service';
import { OnlyForRoles } from '../users/decorators/roles.decorator';
import { Roles } from '../users/enums/roles.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('department')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
  ) {}

  @Get()
  public async getAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @OnlyForRoles(Roles.HEAD_OF_DEPARTMENT)
  public async getById(@Param('id') id) {
    return this.departmentService.findById(id);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<object> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Put(':id')
  public async update(@Param('id') id: number, @Body() departmentDto: CreateDepartmentDto) {
    return await this.departmentService.update(id, departmentDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: number) {
    return this.departmentService.delete(id);
  }
}
