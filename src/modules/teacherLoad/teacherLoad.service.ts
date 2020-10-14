import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TeacherLoad } from './teacherLoad.entity';
import { TeacherLoadInterface, TeacherLoadServiceInterface } from './interfaces';
import { TeacherLoadDto } from './dto/teacherLoad.dto';
import { Department } from '../department/department.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TeacherLoadService implements TeacherLoadServiceInterface {
  constructor(
    @InjectRepository(TeacherLoad)
    private readonly teacherLoadRepository: Repository<TeacherLoad>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadRepository.find();
  }

  findByUserId(id: number): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadRepository.find({ where: { userId: id } });
  }

  async create(data: TeacherLoadDto, user: User): Promise<TeacherLoad> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const teacherLoad = await this.teacherLoadRepository.create({
      ...data,
      department: { id: departmentId },
    });
    await this.teacherLoadRepository.save(teacherLoad);
    return teacherLoad;
  }

  async update(id: number, data: Partial<TeacherLoadDto>): Promise<TeacherLoad> {
    const teacherLoad = await this.teacherLoadRepository.findOne({ where: { id } });

    if (!teacherLoad) {
      throw new NotFoundException();
    }

    return this.teacherLoadRepository.save({ ...teacherLoad, ...data });
  }

  async delete(id: number) {
    const teacherLoad = await this.teacherLoadRepository.findOne({ where: { id } });

    if (!teacherLoad) {
      throw new NotFoundException();
    }

    return this.teacherLoadRepository.remove(teacherLoad);
  }
}
