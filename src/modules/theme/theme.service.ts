import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Theme } from './theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { User } from 'modules/users/user.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { LaboratoryDirection } from '../laboratoryDirection/laboratoryDirection.entity';
import { Group } from '../group/group.entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(AcademicDegree)
    private readonly academicDegreeRepository: Repository<AcademicDegree>,
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(LaboratoryDirection)
    private readonly laboratoryDirectionRepository: Repository<LaboratoryDirection>,
  ) {}

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.find({
      order: { id: 'DESC' },
      relations: ['laboratoryDirection', 'teacher', 'student', 'academicDegree', 'academicYear'],
    });
  }

  async findById(id: number): Promise<Theme> {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return theme;
  }

  async getMyThemes(user: User): Promise<Theme[]> {
    return this.themeRepository.find({
      where: {
        teacherId: user.id,
        departmentId: user.departmentId,
      },
      order: { id: 'DESC' },
      relations: ['academicYear', 'academicDegree', 'laboratoryDirection', 'teacher', 'student', 'requests'],
    });
  }

  async getThemesForStudent(user: User): Promise<Theme[]> {
    const group = await this.groupRepository.findOne(user.groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.themeRepository.find({
      where: {
        departmentId: user.departmentId,
        academicYearId: group.academicYearId,
        academicDegreeId: group.academicDegreeId,
      },
      order: { id: 'DESC' },
      relations: ['laboratoryDirection', 'teacher', 'student'],
    });
  }

  async deleteStudentFromTheme(id: number) {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return this.themeRepository.save({
      ...theme,
      student: null,
    });
  }

  async setConfirmed(id: number, isConfirmed: boolean) {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return this.themeRepository.save({
      ...theme,
      isConfirmed,
    });
  }

  async create(data: CreateThemeDto, user: User): Promise<Theme> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const academicYear = await this.academicYearRepository.findOne(data.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(data.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    const laboratoryDirection = await this.laboratoryDirectionRepository.findOne(data.laboratoryDirectionId);

    if (!laboratoryDirection) {
      throw new NotFoundException('Laboratory direction not found');
    }

    const theme = await this.themeRepository.create({
      ...data,
      teacherId: user.id,
      department: { id: departmentId },
      isConfirmed: false,
      academicYear,
      academicDegree,
      laboratoryDirection,
    });

    return this.themeRepository.save(theme);
  }

  async update(id: number, data: CreateThemeDto): Promise<Theme> {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    const academicYear = await this.academicYearRepository.findOne(data.academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(data.academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    const laboratoryDirection = await this.laboratoryDirectionRepository.findOne(data.laboratoryDirectionId);

    if (!laboratoryDirection) {
      throw new NotFoundException('Laboratory direction not found');
    }

    return await this.themeRepository.save({
      ...theme,
      ...data,
      academicYear,
      academicDegree,
      laboratoryDirection,
    });
  }

  async delete(id: number) {
    const theme = await this.themeRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return this.themeRepository.remove(theme);
  }
}
