import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable, Stream } from 'stream';

import { Theme } from './theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { User } from '../users/user.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { LaboratoryDirection } from '../laboratoryDirection/laboratoryDirection.entity';
import { Group } from '../group/group.entity';
import { downloadFile } from './utils/generateFile';
import { Degree } from 'modules/degree/degree.entity';

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
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
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

  async getStudentTheme(user: User): Promise<Theme> {
    const studentTheme = await this.themeRepository.findOne({
      where: {
        studentId: user.id,
      },
      relations: ['laboratoryDirection', 'teacher', 'student'],
    });

    if (!studentTheme) {
      throw new NotFoundException('Student have no theme');
    }

    return studentTheme;
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

  getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  async downloadFileWithThemes(user: User): Promise<string> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const themes = await this.themeRepository.find({
      where: { departmentId },
      order: { id: 'DESC' },
      relations: ['laboratoryDirection', 'teacher', 'student'],
    });

    const degrees = await this.degreeRepository.find({ where: { departmentId } });
    const teachersDegree = {};
    degrees.forEach(i => {
      teachersDegree[i.id] = i.name;
    });

    const formattedThemes = themes.map(i => ({
      id: i.id,
      student: i.student && (`${i.student.lastName} ${i.student.firstName} ${i.student.middleName}`),
      name: i.name,
      teacher: i.teacher && (`${teachersDegree[i.teacher.degreeId]} ${i.teacher.lastName} ${i.teacher.firstName[0]}.${i.teacher.middleName[0]}.`),
    }));

    return downloadFile(formattedThemes);
  }
}
