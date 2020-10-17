import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TeacherLoad } from './teacherLoad.entity';
import { TeacherLoadInterface, TeacherLoadServiceInterface } from './interfaces';
import { TeacherLoadDto } from './dto/teacherLoad.dto';
import { Department } from '../department/department.entity';
import { User } from '../users/user.entity';
import { Roles } from '../users/enums/roles.enum';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';

@Injectable()
export class TeacherLoadService implements TeacherLoadServiceInterface {
  constructor(
    @InjectRepository(TeacherLoad)
    private readonly teacherLoadRepository: Repository<TeacherLoad>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AcademicDegree)
    private readonly academicDegreeRepository: Repository<AcademicDegree>,
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadRepository.find({
      order: { id: 'DESC' },
      relations: ['academicDegree', 'academicYear', 'user'],
    });
  }

  findByUserId(id: number): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadRepository.find({ where: { userId: id } });
  }

  async create(data: TeacherLoadDto, user: User): Promise<TeacherLoad> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const teacher = await this.userRepository.findOne({
      where: { id: data.userId, role: Roles.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const academicYear = await this.academicYearRepository.findOne(data.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(data.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    const teacherLoad = await this.teacherLoadRepository.create({
      ...data,
      department: { id: departmentId },
      user: teacher,
      academicYear,
      academicDegree,
    });

    return this.teacherLoadRepository.save(teacherLoad);
  }

  async update(id: number, data: Partial<TeacherLoadDto>): Promise<TeacherLoad> {
    const teacherLoad = await this.teacherLoadRepository.findOne(id);

    if (!teacherLoad) {
      throw new NotFoundException();
    }

    const user = await this.userRepository.findOne({
      where: { id: data.userId, role: Roles.TEACHER },
    });

    if (!user) {
      throw new NotFoundException('Teacher not found');
    }

    const academicYear = await this.academicYearRepository.findOne(data.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(data.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    return this.teacherLoadRepository.save({
      ...teacherLoad,
      ...data,
      user,
      academicYear,
      academicDegree,
    });
  }

  async delete(id: number) {
    const teacherLoad = await this.teacherLoadRepository.findOne(id);

    if (!teacherLoad) {
      throw new NotFoundException();
    }

    return this.teacherLoadRepository.remove(teacherLoad);
  }
}
