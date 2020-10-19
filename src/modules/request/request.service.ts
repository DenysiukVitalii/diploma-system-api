import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request } from './request.entity';
import { Theme } from '../theme/theme.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from 'modules/users/user.entity';
import { Statuses } from './enums/statuses.enum';
import { ActionRequestDto } from './dto/action-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
  ) {}

  async findAll(user: User): Promise<Request[]> {
    return this.requestRepository.find({
      where: { studentId: user.id },
      order: { id: 'DESC' },
      relations: ['theme'],
    });
  }

  async findAllAndDelete(user: User, themeId) {
    const requests = await this.requestRepository.find({
      where: [
        { studentId: user.id },
        { themeId }, // todo doe'nt work
      ],
    });

    const ids = requests.map(el => el.id);
    await this.requestRepository.delete(ids);
  }

  async findById(id: number): Promise<Request> {
    const request = await this.requestRepository.findOne(id, {
      relations: ['theme'],
    });

    if (!request) {
      throw new NotFoundException();
    }

    return request;
  }

  async create(data: CreateRequestDto, user: User): Promise<Request> {
    const findRequest = await this.requestRepository.findOne({
      where: {
        themeId: data.themeId,
        studentId: user.id,
      },
    });

    if (findRequest) {
      throw new Error('Request already exist');
    }

    const request = await this.requestRepository.create({
      ...data,
      studentId: user.id,
      status: Statuses.PENDING,
    });

    await this.requestRepository.save(request);
    return this.findById(request.id);
  }

  async update(id: number, data: ActionRequestDto, user: User): Promise<Request> {
    const request = await this.findById(id);

    if (!request) {
      throw new NotFoundException();
    }

    if (data.status === Statuses.CONFIRMED) {
      await this.themeRepository.save({
        ...request.theme,
        student: request.student,
      });

      await this.findAllAndDelete(user, request.themeId);
      return { ...request, status: Statuses.CONFIRMED };
    } else {
      // @ts-ignore
      return this.requestRepository.save({
        ...request,
        ...data,
      });
    }
  }

  async delete(id: number) {
    const request = await this.requestRepository.findOne(id);

    if (!request) {
      throw new NotFoundException();
    }

    return this.requestRepository.remove(request);
  }
}
