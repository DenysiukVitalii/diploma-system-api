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
import { downloadFile } from './utils/generateFile';
import { DegreesDto } from './dto/degrees.dto';

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

  findAll(user: User): Promise<TeacherLoadInterface[]> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    return this.teacherLoadRepository.find({
      where: { departmentId },
      order: { id: 'DESC' },
      relations: ['academicDegree', 'academicYear', 'user'],
    });
  }

  findByUserId(id: number): Promise<TeacherLoadInterface[]> {
    return this.teacherLoadRepository.find({
      where: { userId: id },
      relations: ['academicDegree', 'academicYear'],
    });
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

  async downloadFileWithLoad(
    user: User,
    academicYearId: number,
    degrees: number[],
  ): Promise<string> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const academicYear = await this.academicYearRepository.findOne(academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegrees = await this.academicDegreeRepository.find();

    const loads = await this.teacherLoadRepository.find({
      where: { departmentId },
      relations: ['academicDegree'],
    });

    const users = await this.userRepository.find({
      where: { departmentId, role: Roles.TEACHER },
    });

    const data = [];

    users.forEach(i => {
      const total = loads.reduce(
        (acc, val) => val.userId === i.id
          ? acc + val.amount
          : acc,
        0);

      const loadByDegrees = loads.reduce((acc, val) =>
        val.userId === i.id && degrees.includes(val.academicDegreeId)
          ? [
            ...acc,
            {
              amount: val.amount,
              name: val.academicDegree && val.academicDegree.name,
              id: val.academicDegree && val.academicDegree.id,
            },
          ]
          : acc, []
      );

      if (loadByDegrees.length !== degrees.length) {
        degrees.forEach(degree => {
          const academicDegree = academicDegrees.find(item => item.id === degree);
          const isDegreesIncluded = loadByDegrees.map(i => i.name).includes(academicDegree.name);

          if (academicDegree && !isDegreesIncluded) {
            loadByDegrees.push({
              amount: 0,
              name: academicDegree.name,
              id: academicDegree.id,
            });
          }
        });
      }

      const sortedLoadByDegrees = new Array(degrees.length);

      degrees.forEach((degree, idx) => {
        sortedLoadByDegrees[idx] = loadByDegrees.find(i => i.id === degree);
      });

      data.push({
        fullName: `${i.lastName} ${i.firstName[0]}.${i.middleName[0]}.`,
        total,
        loadByDegrees: sortedLoadByDegrees,
      });
    });

    const resultDegrees = {};

    degrees.forEach((i, idx) => {
      const academicDegree = academicDegrees.find(item => item.id === i);
      resultDegrees[`degree${idx + 1}`] = academicDegree.name;
    });

    return downloadFile(data, resultDegrees);
  }
}
