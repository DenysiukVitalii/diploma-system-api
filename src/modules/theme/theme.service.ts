import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Theme } from './theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { User } from 'modules/users/user.entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
  ) {}

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.find();
  }

  async findById(id: number): Promise<Theme> {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return theme;
  }

  async create(data: CreateThemeDto, user: User): Promise<Theme> {
    const { departmentId } = user;
    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const theme = await this.themeRepository.create({
      ...data,
      teacherId: user.id,
      department: { id: departmentId },
    });

    await this.themeRepository.save(theme);
    return theme;
  }

  async update(id: number, data: CreateThemeDto): Promise<Theme> {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return await this.themeRepository.save({ ...theme, ...data });
  }

  async delete(id: number) {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return this.themeRepository.remove(theme);
  }
}
