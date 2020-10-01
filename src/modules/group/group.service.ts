import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  async findById(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne(id);

    if (!group) {
      throw new NotFoundException();
    }

    return group;
  }

  async create(data: CreateGroupDto): Promise<Group> {
    const group = await this.groupRepository.create(data);

    await this.groupRepository.save(group);

    return group;
  }

  async update(id: number, data: CreateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOne(id);

    if (!group) {
      throw new NotFoundException();
    }

    return await this.groupRepository.save({ ...group, ...data });
  }

  async delete(id: number) {
    const group = await this.groupRepository.findOne(id);

    if (!group) {
      throw new NotFoundException();
    }

    return this.groupRepository.remove(group);
  }
}
