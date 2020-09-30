import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicDegree } from './academicDegree.entity';
import { AcademicDegreeInterface, AcademicDegreeServiceInterface } from './interfaces';
import { AcademicDegreeDto } from './dto/academicDegree.dto';

@Injectable()
export class AcademicDegreeService implements AcademicDegreeServiceInterface {
  constructor(
    @InjectRepository(AcademicDegree)
    private readonly academicDegreeRepository: Repository<AcademicDegree>,
  ) {}

  findAll(): Promise<AcademicDegree[]> {
    return this.academicDegreeRepository.find();
  }

  async create(data: AcademicDegreeInterface): Promise<AcademicDegree> {
    const academicDegree = await this.academicDegreeRepository.create(data);
    await this.academicDegreeRepository.save(academicDegree);
    return academicDegree;
  }

  async update(id: number, data: Partial<AcademicDegreeDto>): Promise<AcademicDegree> {
    const academicDegree = await this.academicDegreeRepository.findOne({ where: { id } });

    if (!academicDegree) {
      throw new NotFoundException();
    }

    return this.academicDegreeRepository.save({ ...academicDegree, ...data });
  }

  async delete(id: number) {
    const academicDegree = await this.academicDegreeRepository.findOne({ where: { id } });

    if (!academicDegree) {
      throw new NotFoundException();
    }

    return this.academicDegreeRepository.remove(academicDegree);
  }

}
