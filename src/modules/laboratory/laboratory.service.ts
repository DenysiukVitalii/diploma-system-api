import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Laboratory } from './laboratory.entity';
import { LaboratoryInterface, LaboratoryServiceInterface } from './interfaces';
import { LaboratoryDto } from './dto/laboratory.dto';

@Injectable()
export class LaboratoryService implements LaboratoryServiceInterface {
  constructor(
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,
  ) {}

  findAll(): Promise<Laboratory[]> {
    return this.laboratoryRepository.find();
  }

  async create(data: LaboratoryInterface): Promise<Laboratory> {
    const laboratory = await this.laboratoryRepository.create(data);
    await this.laboratoryRepository.save(laboratory);
    return laboratory;
  }

  async update(id: number, data: Partial<LaboratoryDto>): Promise<Laboratory> {
    const laboratory = await this.laboratoryRepository.findOne({ where: { id } });

    if (!laboratory) {
      throw new NotFoundException();
    }

    return this.laboratoryRepository.save({ ...laboratory, ...data });
  }

  async delete(id: number) {
    const laboratory = await this.laboratoryRepository.findOne({ where: { id } });

    if (!laboratory) {
      throw new NotFoundException();
    }

    return this.laboratoryRepository.remove(laboratory);
  }
}
