import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Degree } from './degree.entity';
import { DegreeServiceInterface } from './interfaces';
import { DegreeDto } from './dto/degree.dto';
import { Department } from '../department/department.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DegreeService implements DegreeServiceInterface {
  constructor(
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Degree[]> {
    return this.degreeRepository.find();
  }

  async create(data: DegreeDto, user: User): Promise<Degree> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const degree = await this.degreeRepository.create({
      ...data,
      department: { id: departmentId },
    });
    await this.degreeRepository.save(degree);
    return degree;
  }

  async update(id: number, data: Partial<DegreeDto>): Promise<Degree> {
    const degree = await this.degreeRepository.findOne({ where: { id } });

    if (!degree) {
      throw new NotFoundException();
    }

    return this.degreeRepository.save({ ...degree, ...data });
  }

  async delete(id: number) {
    const degree = await this.degreeRepository.findOne({ where: { id } });

    if (!degree) {
      throw new NotFoundException();
    }

    return this.degreeRepository.remove(degree);
  }
}
