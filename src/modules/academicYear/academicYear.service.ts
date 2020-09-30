import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicYear } from './academicYear.entity';
import { AcademicYearInterface, AcademicYearServiceInterface } from './interfaces';
import { AcademicYearDto } from './dto/academicYear.dto';

@Injectable()
export class AcademicYearService implements AcademicYearServiceInterface {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) {}

  findAll(): Promise<AcademicYear[]> {
    return this.academicYearRepository.find();
  }

  async create(data: AcademicYearInterface): Promise<AcademicYear> {
    const academicYear = await this.academicYearRepository.create(data);
    await this.academicYearRepository.save(academicYear);
    return academicYear;
  }

  async update(id: number, data: Partial<AcademicYearDto>): Promise<AcademicYear> {
    const academicYear = await this.academicYearRepository.findOne({ where: { id } });

    if (!academicYear) {
      throw new NotFoundException();
    }

    return this.academicYearRepository.save({ ...academicYear, ...data });
  }

  async delete(id: number) {
    const academicYear = await this.academicYearRepository.findOne({ where: { id } });

    if (!academicYear) {
      throw new NotFoundException();
    }

    return this.academicYearRepository.remove(academicYear);
  }
}
