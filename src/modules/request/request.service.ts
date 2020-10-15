import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from 'modules/users/user.entity';
import { Statuses } from './enums/statuses.enum';
import { ActionRequestDto } from './dto/action-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async findAll(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  async findById(id: number): Promise<Request> {
    const request = await this.requestRepository.findOne(id);

    if (!request) {
      throw new NotFoundException();
    }

    return request;
  }

  async create(data: CreateRequestDto, user: User): Promise<Request> {
    const request = await this.requestRepository.create({
      ...data,
      studentId: user.id,
      status: Statuses.PENDING,
    });

    await this.requestRepository.save(request);
    return request;
  }

  async update(id: number, data: ActionRequestDto): Promise<Request> {
    const request = await this.requestRepository.findOne(id);

    if (!request) {
      throw new NotFoundException();
    }

    return this.requestRepository.save({ ...request, ...data });
  }

  async delete(id: number) {
    const request = await this.requestRepository.findOne(id);

    if (!request) {
      throw new NotFoundException();
    }

    return this.requestRepository.remove(request);
  }
}
