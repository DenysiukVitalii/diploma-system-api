import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { User } from 'modules/users/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      order: { id: 'DESC' },
      relations: ['academicDegree', 'academicYear'],
    });
  }

  async findById(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne(id, {
      order: { id: 'DESC' },
      relations: ['academicDegree', 'academicYear'],
    });

    if (!group) {
      throw new NotFoundException();
    }

    return group;
  }

  async create(data: CreateGroupDto, user: User): Promise<Group> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const group = await this.groupRepository.create({
      ...data,
      department: { id: departmentId },
    });

    await this.groupRepository.save(group);
    return this.findById(group.id);
  }

  async update(id: number, data: CreateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOne(id);

    if (!group) {
      throw new NotFoundException();
    }

    await this.groupRepository.save({ ...group, ...data });
    return this.findById(group.id);
  }

  async delete(id: number) {
    const group = await this.groupRepository.findOne(id);

    if (!group) {
      throw new NotFoundException();
    }

    return this.groupRepository.remove(group);
  }
}
