
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Theme } from './theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { User } from '../users/user.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { LaboratoryDirection } from '../laboratoryDirection/laboratoryDirection.entity';
import { Group } from '../group/group.entity';
import { downloadFile } from './utils/generateFile';
import { Degree } from '../degree/degree.entity';
import { Roles } from '../users/enums/roles.enum';
import { getStudentFullName, getStudentsByGroup, getTeacherByThemeAndStudent, getTeacherFullName, getThemeByStudent } from './utils/utils';
import { TeacherLoad } from '../teacherLoad/teacherLoad.entity';
import { ApplicationMailerService } from 'modules/mailer/mailer.service';
import { MessageType } from 'modules/mailer/constants/mailer.constants';
import { getFullName } from '../../common/utils';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TeacherLoad)
    private readonly teacherLoadRepository: Repository<TeacherLoad>,
    private readonly mailerService: ApplicationMailerService,
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

  async deleteStudentFromTheme(id: number, user: User) {
    const theme = await this.themeRepository.findOne({
      where: { id, teacherId: user.id },
    });

    if (!theme) {
      throw new NotFoundException();
    }

    return this.themeRepository.save({
      ...theme,
      student: null,
    });
  }

  async setConfirmed(id: number, isConfirmed: boolean) {
    const theme = await this.themeRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!theme) {
      throw new NotFoundException();
    }

    await this.mailerService.sendMail(
      theme.teacher.email,
      MessageType.ThemeAction,
      {
        teacher: getFullName(theme.teacher),
        theme: theme.name,
        isConfirmed: isConfirmed ? 'Так' : 'Ні',
      },
    );

    return this.themeRepository.save({
      ...theme,
      isConfirmed,
    });
  }

  async create(data: CreateThemeDto, user: User): Promise<Theme> {
    const { departmentId, id } = user;

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

    const teacherLoad = await this.teacherLoadRepository.findOne({
      where: {
        userId: id,
        academicYearId: academicYear.id,
        academicDegreeId: academicDegree.id,
      },
    });

    if (!teacherLoad) {
      throw new NotFoundException('Teacher load is not set');
    }

    const myThemesAmount = await this.themeRepository.count({
      where: {
        teacherId: user.id,
        departmentId: user.departmentId,
        academicYearId: academicYear.id,
        academicDegreeId: academicDegree.id,
      },
    });

    if (teacherLoad.amount > myThemesAmount) {
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
    } else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Teacher load is full',
      }, HttpStatus.BAD_REQUEST);
    }
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

  async downloadFileWithThemes(
    user: User,
    academicYearId: number,
    academicDegreeId: number,
  ): Promise<string> {
    const { departmentId } = user;

    if (!departmentId) {
      throw new NotFoundException('Department not found');
    }

    const academicYear = await this.academicYearRepository.findOne(academicYearId);

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    const academicDegree = await this.academicDegreeRepository.findOne(academicDegreeId);

    if (!academicDegree) {
      throw new NotFoundException('Academic degree not found');
    }

    const themes = await this.themeRepository.find({
      where: {
        departmentId,
        academicDegreeId: academicDegree.id,
        academicYearId: academicYear.id,
      },
      order: { id: 'DESC' },
      relations: ['laboratoryDirection', 'teacher', 'student'],
    });

    const groups = await this.groupRepository.find({
      where: {
        departmentId,
        academicDegreeId: academicDegree.id,
        academicYearId: academicYear.id,
      },
      relations: ['specialty'],
    });

    const users = await this.userRepository.find({
      where: { departmentId, role: Roles.STUDENT },
    });

    const degrees = await this.degreeRepository.find({ where: { departmentId } });
    const teachersDegree = {};
    degrees.forEach(i => {
      teachersDegree[i.id] = i.name;
    });

    const formattedThemes = themes.map(i => ({
      id: i.id,
      student: getStudentFullName(i.student),
      studentId: i.student && i.student.id,
      name: i.name,
      teacher: getTeacherFullName(i.teacher, teachersDegree[i.teacher.degreeId]),
    }));

    const data = groups.map(group => ({
      specialty: group.specialty,
      groupName: group.name,
      themes: [
        ...getStudentsByGroup(users, group.id)
          .map(i => ({
            id: i.id,
            student: getStudentFullName(i),
            groupId: i.groupId,
            name: getThemeByStudent(formattedThemes, i.id),
            teacher: getTeacherByThemeAndStudent(formattedThemes, i.id),
          })),
      ],
    }));

    return downloadFile(data, academicDegree.name);
  }
}
