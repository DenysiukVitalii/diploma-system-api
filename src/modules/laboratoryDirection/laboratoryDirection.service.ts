import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LaboratoryDirection } from './laboratoryDirection.entity';
import { LaboratoryDirectionInterface, LaboratoryDirectionServiceInterface } from './interfaces';
import { LaboratoryDirectionDto } from './dto/laboratoryDirection.dto';

@Injectable()
export class LaboratoryDirectionService implements LaboratoryDirectionServiceInterface {
  constructor(
    @InjectRepository(LaboratoryDirection)
    private readonly laboratoryDirectionRepository: Repository<LaboratoryDirection>,
  ) {}

  findAll(): Promise<LaboratoryDirection[]> {
    return this.laboratoryDirectionRepository.find();
  }

  async create(data: LaboratoryDirectionInterface): Promise<LaboratoryDirection> {
    const laboratoryDirection = await this.laboratoryDirectionRepository.create({
      ...data,
      laboratory: { id: data.laboratoryId },
    });
    await this.laboratoryDirectionRepository.save(laboratoryDirection);
    return laboratoryDirection;
  }

  async update(id: number, data: Partial<LaboratoryDirectionDto>): Promise<LaboratoryDirection> {
    const laboratoryDirection = await this.laboratoryDirectionRepository.findOne({ where: { id } });

    if (!laboratoryDirection) {
      throw new NotFoundException();
    }

    return this.laboratoryDirectionRepository.save({ ...laboratoryDirection, ...data });
  }

  async delete(id: number) {
    const laboratoryDirection = await this.laboratoryDirectionRepository.findOne({ where: { id } });

    if (!laboratoryDirection) {
      throw new NotFoundException();
    }

    return this.laboratoryDirectionRepository.remove(laboratoryDirection);
  }
}
