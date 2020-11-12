import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { User } from '../users/user.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { downloadFile } from './utils/generateFile';
import { ScheduleParams } from './interfaces/scheduleParams.interface';

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

  async findAll(user: User, params: ScheduleParams): Promise<Schedule[]> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const academicYear = await this.academicYearRepository.findOne(params.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(params.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    return this.scheduleRepository.find({
      where: {
        departmentId,
        academicYearId: academicYear.id,
        academicDegreeId: academicDegree.id,
      },
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

  async downloadFileWithSchedule(
    user: User,
    params: ScheduleParams,
  ): Promise<string> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const academicYear = await this.academicYearRepository.findOne(params.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(params.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    const schedule = await this.findAll(user, params);

    const data = schedule.map((item, idx) => ({
      id: item.id,
      number: `${idx + 1}.`,
      name: item.name,
      dates: `${item.startDate} - ${item.endDate}`,
      description: item.description,
      notes: '',
    }));

    return downloadFile(data, academicYear.name, academicDegree.name);
  }
}
