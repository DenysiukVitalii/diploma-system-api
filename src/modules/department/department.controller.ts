import { Body, Controller, Param, Get, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';

import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentService } from './department.service';

@UseGuards(JwtAdminAuthGuard)
@Controller('department')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
  ) {}

  @Get()
  public async getAll(@Query() query: object) {
    return this.departmentService.findAll(query);
  }

  @Get(':id')
  public async getById(@Param('id') id) {
    return this.departmentService.findById(id);
  }

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
