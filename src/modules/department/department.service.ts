import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { paginateRepository, Pagination } from '../../common/paginate';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(query): Promise<Pagination<Department>> {
    const { perPage = 10, page = 1 } = query;
    return paginateRepository(this.departmentRepository, { perPage, page });
  }

  async findById(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);

    if (!department) {
      throw new NotFoundException();
    }

    return department;
  }

  async create(data: CreateDepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.create(data);

    await this.departmentRepository.save(department);

    return department;
  }

  async update(id: number, data: CreateDepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);

    if (!department) {
      throw new NotFoundException();
    }

    return await this.departmentRepository.save({ ...department, ...data });
  }

  async delete(id: number) {
    const department = await this.departmentRepository.findOne(id);

    if (!department) {
      throw new NotFoundException();
    }

    return this.departmentRepository.remove(department);
  }
}
