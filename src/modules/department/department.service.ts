import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
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
