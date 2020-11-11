import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LaboratoryDirection } from './laboratoryDirection.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { LaboratoryDirectionInterface, LaboratoryDirectionServiceInterface } from './interfaces';
import { LaboratoryDirectionDto } from './dto/laboratoryDirection.dto';
import { User } from 'modules/users/user.entity';

@Injectable()
export class LaboratoryDirectionService implements LaboratoryDirectionServiceInterface {
  constructor(
    @InjectRepository(LaboratoryDirection)
    private readonly laboratoryDirectionRepository: Repository<LaboratoryDirection>,
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,
  ) {}

  async findAll(user: User): Promise<LaboratoryDirection[]> {
    const { departmentId } = user;

    const allDirections = await this.laboratoryDirectionRepository.find({
      relations: ['laboratory'],
      order: {
        id: 'DESC',
      },
    });

    return allDirections.filter(i => i.laboratory && i.laboratory.departmentId === departmentId);
  }

  async create(data: LaboratoryDirectionInterface): Promise<LaboratoryDirection> {
    const laboratory = await this.laboratoryRepository.findOne(data.laboratoryId);

    if (!laboratory) {
      throw new NotFoundException('Laboratory not found');
    }

    const laboratoryDirection = await this.laboratoryDirectionRepository.create({
      ...data,
      laboratory,
    });

    return this.laboratoryDirectionRepository.save(laboratoryDirection);
  }

  async update(id: number, data: Partial<LaboratoryDirectionDto>): Promise<LaboratoryDirection> {
    const laboratoryDirection = await this.laboratoryDirectionRepository.findOne({ where: { id } });

    if (!laboratoryDirection) {
      throw new NotFoundException();
    }

    const laboratory = await this.laboratoryRepository.findOne(data.laboratoryId);

    if (!laboratory) {
      throw new NotFoundException('Laboratory not found');
    }

    return this.laboratoryDirectionRepository.save({ ...laboratoryDirection, ...data, laboratory });
  }

  async delete(id: number) {
    const laboratoryDirection = await this.laboratoryDirectionRepository.findOne({ where: { id } });

    if (!laboratoryDirection) {
      throw new NotFoundException();
    }

    return this.laboratoryDirectionRepository.remove(laboratoryDirection);
  }
}
