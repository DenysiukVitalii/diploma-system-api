import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { User } from 'modules/users/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
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

    const schedule = await this.scheduleRepository.create({
      ...data,
      department: { id: departmentId },
    });

    await this.scheduleRepository.save(schedule);
    return this.findById(schedule.id);
  }

  async update(id: number, data: CreateScheduleDto): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne(id);

    if (!schedule) {
      throw new NotFoundException();
    }

    await this.scheduleRepository.save({ ...schedule, ...data });
    return this.findById(schedule.id);
  }

  async delete(id: number) {
    const schedule = await this.scheduleRepository.findOne(id);

    if (!schedule) {
      throw new NotFoundException();
    }

    return this.scheduleRepository.remove(schedule);
  }
}
