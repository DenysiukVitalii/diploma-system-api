import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Protection } from './protection.entity';
import { CreateProtectionTypeDto } from './dto/create-protectionType.dto';
import { User } from '../users/user.entity';
import { ProtectionType } from './protectionType.entity';
import { CreateProtectionDto } from './dto/create-protection.dto';

@Injectable()
export class ProtectionService {
  constructor(
    @InjectRepository(ProtectionType)
    private readonly protectionTypeRepository: Repository<ProtectionType>,
    @InjectRepository(Protection)
    private readonly protectionRepository: Repository<Protection>,
  ) {}

  async createProtectionType(data: CreateProtectionTypeDto, user: User): Promise<ProtectionType> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const protectionType = await this.protectionTypeRepository.create({
      ...data,
      department: { id: departmentId },
    });

    await this.protectionTypeRepository.save(protectionType);
    return protectionType;
  }

  async createProtection(data: CreateProtectionDto): Promise<Protection> {
    const protectionType = await this.findProtectionTypeById(data.protectionTypeId);

    if (!protectionType) {
      throw new NotFoundException('Department not found');
    }

    const protection = await this.protectionRepository.create({
      ...data,
      protectionType: { id: protectionType.id },
    });

    await this.protectionRepository.save(protection);
    return protection;
  }

  async findAllProtectionTypes(): Promise<ProtectionType[]> {
    return this.protectionTypeRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findAllProtections(): Promise<Protection[]> {
    return this.protectionRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findProtectionTypeById(id: number): Promise<ProtectionType> {
    const protectionType = await this.protectionTypeRepository.findOne(id, {
      order: { id: 'DESC' },
    });

    if (!protectionType) {
      throw new NotFoundException();
    }

    return protectionType;
  }
}
