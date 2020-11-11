import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { User } from '../users/user.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(AcademicDegree)
    private readonly academicDegreeRepository: Repository<AcademicDegree>,
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) {}

  async findAll(user: User): Promise<Schedule[]> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    return this.scheduleRepository.find({
      where: { departmentId },
      relations: ['academicDegree', 'academicYear'],
    });
  }

  async findById(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne(id, {
      order: { id: 'DESC' },
      relations: ['academicDegree', 'academicYear'],
    });

    if (!schedule) {
      throw new NotFoundException();
    }

    return schedule;
  }

  async create(data: CreateScheduleDto, user: User): Promise<Schedule> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const academicYear = await this.academicYearRepository.findOne(data.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(data.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    const schedule = await this.scheduleRepository.create({
      ...data,
      department: { id: departmentId },
      academicYear,
      academicDegree,
    });

    return this.scheduleRepository.save(schedule);
  }

  async update(id: number, data: CreateScheduleDto): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne(id);

    if (!schedule) {
      throw new NotFoundException();
    }

    const academicYear = await this.academicYearRepository.findOne(data.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(data.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    return  this.scheduleRepository.save({
      ...schedule,
      ...data,
      academicYear,
      academicDegree,
    });
  }

  async delete(id: number) {
    const schedule = await this.scheduleRepository.findOne(id);

    if (!schedule) {
      throw new NotFoundException();
    }

    return this.scheduleRepository.remove(schedule);
  }
}
