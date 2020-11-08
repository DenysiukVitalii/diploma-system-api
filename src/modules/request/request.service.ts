import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request } from './request.entity';
import { Theme } from '../theme/theme.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from '../users/user.entity';
import { Statuses } from './enums/statuses.enum';
import { ActionRequestDto } from './dto/action-request.dto';
import { ApplicationMailerService } from '../mailer/mailer.service';
import { MessageType } from '../mailer/constants/mailer.constants';
import { getFullName } from '../../common/utils';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: ApplicationMailerService,
  ) {}

  async findAll(user: User): Promise<Request[]> {
    return this.requestRepository.find({
      where: { studentId: user.id },
      order: { id: 'DESC' },
      relations: ['theme'],
    });
  }

  async findAllAndDelete(user: User, themeId) {
    const request = await this.requestRepository.findOne({
      where: { studentId: user.id, themeId },
    });

    console.log('request', request);

    // const ids = request.map(el => el.id);
    await this.requestRepository.delete(request.id);
  }

  async findById(id: number): Promise<Request> {
    const request = await this.requestRepository.findOne(id, {
      relations: ['theme', 'student'],
    });

    if (!request) {
      throw new NotFoundException();
    }

    return request;
  }

  async create(data: CreateRequestDto, user: User): Promise<Request> {
    const studentTheme = await this.themeRepository.findOne({
      where: { studentId: user.id },
    });

    if (studentTheme) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Student already has theme',
      }, HttpStatus.BAD_REQUEST);
    }

    const findRequest = await this.requestRepository.findOne({
      where: {
        themeId: data.themeId,
        studentId: user.id,
      },
    });

    if (findRequest) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Request already exist',
      }, HttpStatus.BAD_REQUEST);
    }

    const theme = await this.themeRepository.findOne({
      where: { id: data.themeId },
      relations: ['teacher'],
    });

    if (!theme) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Theme not found',
      }, HttpStatus.BAD_REQUEST);
    }

    const request = await this.requestRepository.create({
      ...data,
      studentId: user.id,
      status: Statuses.PENDING,
    });

    await this.requestRepository.save(request);

    const { teacher } = theme;

    await this.mailerService.sendMail(
      theme.teacher.email,
      MessageType.RequestCreated,
      {
        teacher: getFullName(teacher),
        student: getFullName(user),
        group: user.group.name,
        theme: theme.name,
      },
    );

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

      await this.findAllAndDelete(request.student, request.themeId);

      await this.mailerService.sendMail(
        request.student.email,
        MessageType.RequestConfirmed,
        {
          teacher: getFullName(user),
          student: getFullName(request.student),
          theme: request.theme.name,
        },
      );

      return { ...request, status: Statuses.CONFIRMED };
    } else {
      await this.mailerService.sendMail(
        request.student.email,
        MessageType.RequestRejected,
        {
          teacher: getFullName(user),
          student: getFullName(request.student),
          theme: request.theme.name,
        },
      );

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
