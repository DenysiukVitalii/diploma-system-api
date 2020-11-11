import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Specialty } from './specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { User } from '../users/user.entity';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async findAll(user: User): Promise<Specialty[]> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    return this.specialtyRepository.find({
      where: { departmentId },
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOne(id, {
      order: { id: 'DESC' },
    });

    if (!specialty) {
      throw new NotFoundException();
    }

    return specialty;
  }

  async create(data: CreateSpecialtyDto, user: User): Promise<Specialty> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const specialty = await this.specialtyRepository.create({
      ...data,
      department: { id: departmentId },
    });

    await this.specialtyRepository.save(specialty);
    return this.findById(specialty.id);
  }

  async update(id: number, data: CreateSpecialtyDto): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOne(id);

    if (!specialty) {
      throw new NotFoundException();
    }

    await this.specialtyRepository.save({ ...specialty, ...data });
    return this.findById(specialty.id);
  }

  async delete(id: number) {
    const specialty = await this.specialtyRepository.findOne(id);

    if (!specialty) {
      throw new NotFoundException();
    }

    return this.specialtyRepository.remove(specialty);
  }
}
