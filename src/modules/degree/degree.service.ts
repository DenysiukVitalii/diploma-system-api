import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Degree } from './degree.entity';
import { DegreeInterface, DegreeServiceInterface } from './interfaces';
import { DegreeDto } from './dto/degree.dto';

@Injectable()
export class DegreeService implements DegreeServiceInterface {
  constructor(
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
  ) {}

  findAll(): Promise<Degree[]> {
    return this.degreeRepository.find();
  }

  async create(data: DegreeInterface): Promise<Degree> {
    const degree = await this.degreeRepository.create(data);
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
