import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Protection } from './protection.entity';
import { CreateProtectionTypeDto } from './dto/create-protectionType.dto';
import { User } from '../users/user.entity';
import { ProtectionType } from './protectionType.entity';
import { CreateProtectionDto } from './dto/create-protection.dto';
import { Comission } from './comission.entity';
import { StudentProtection } from './studentProtection.entity';
import { Roles } from '../users/enums/roles.enum';
import { getTeacherFullName } from '../theme/utils/utils';
import { Group } from 'modules/group/group.entity';
import { downloadFile } from './utils/generateFile';

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

@Injectable()
export class ProtectionService {
  constructor(
    @InjectRepository(ProtectionType)
    private readonly protectionTypeRepository: Repository<ProtectionType>,
    @InjectRepository(Protection)
    private readonly protectionRepository: Repository<Protection>,
    @InjectRepository(Comission)
    private readonly comissionRepository: Repository<Comission>,
    @InjectRepository(StudentProtection)
    private readonly studentProtectionRepository: Repository<StudentProtection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
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

    const protectionData = {
      protectionTypeId: data.protectionTypeId,
      groupId: data.groupId,
      date: data.date,
      place: data.place,
    };

    const protection = await this.protectionRepository.create({
      ...protectionData,
      protectionType: { id: protectionType.id },
    });

    await this.protectionRepository.save(protection);

    const availableStudents = await this.getAvailableStudents(protectionType.id, data.groupId, true);

    for (const teacherId of data.teacherIds) {
      const teacher = await this.userRepository.findOne({
        where: { id: teacherId, role: Roles.TEACHER },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      const comission = await this.comissionRepository.create({
        protection: { id: protection.id },
        teacher: { id: teacher.id },
      });

      await this.comissionRepository.save(comission);
    }

    for (const studentId of data.studentsIds) {
      const student = await this.userRepository.findOne({
        where: { id: studentId, role: Roles.STUDENT },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      if (!availableStudents.includes(student.id)) {
        throw new NotFoundException(`Student ${student.lastName} is busy`);
      }

      const studentProtection = await this.studentProtectionRepository.create({
        protection: { id: protection.id },
        student: { id: student.id },
      });

      await this.studentProtectionRepository.save(studentProtection);
    }

    return this.findProtectionById(protection.id);
  }

  async getAvailableStudents(protectionTypeId: number, groupId: number, onlyId: boolean = false): Promise<any[]> {
    const createdProtections = await this.protectionRepository.find({
      where: { protectionTypeId, groupId },
      relations: ['studentProtections'],
    });

    const busyStudents = flatten(createdProtections.map(i => i.studentProtections)).map(i => i.student.id);
    const students = await this.userRepository.find({ where: { groupId } });

    const availableStudents = students.filter(e => !busyStudents.includes(e.id));

    if (onlyId) {
      return availableStudents.map(i => i.id);
    }

    return availableStudents;
  }

  async findAllProtectionTypes(): Promise<ProtectionType[]> {
    return this.protectionTypeRepository.find({
      order: { id: 'ASC' },
      relations: ['protections'],
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

  async findProtectionById(id: number): Promise<Protection> {
    const protection = await this.protectionRepository.findOne(id, {
      order: { id: 'DESC' },
      relations: ['comissions', 'studentProtections', 'protectionType'],
    });

    if (!protection) {
      throw new NotFoundException();
    }

    return protection;
  }

  async findProtections(): Promise<object[]> {
    const protections = await this.protectionRepository.find({
      order: { id: 'DESC' },
      relations: ['group', 'comissions', 'studentProtections', 'protectionType'],
    });

    if (!protections) {
      throw new NotFoundException();
    }

    const result = protections.map(i => ({
      id: i.id,
      date: i.date,
      place: i.place,
      group: i.group.name,
      protection: i.protectionType,
      comission: i.comissions.map(j => `${j.teacher.lastName} ${j.teacher.firstName[0]}.${j.teacher.middleName[0]}.`),
      students: i.studentProtections.map(j => `${j.student.lastName} ${j.student.firstName[0]}.${j.student.middleName[0]}.`)
    }));

    return result;
  }

  async findProtectionsByGroupId(groupId: number) {
    const protectionTypes = await this.findAllProtectionTypes();
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    const protections = await this.protectionRepository.find({
      order: { id: 'DESC' },
      where: { groupId },
      relations: ['group', 'comissions', 'studentProtections', 'protectionType'],
    });

    if (!protections) {
      throw new NotFoundException();
    }

    const data = protectionTypes.map(i => ({
      protectionType: i.name,
      meetings: protections.reduce((acc, val) => val.protectionTypeId === i.id
        ? [
            ...acc,
            {
              date: val.date,
              place: val.place,
              teachers: val.comissions.map(k => `${k.teacher.lastName} ${k.teacher.firstName[0]}.${k.teacher.middleName[0]}.`),
              students: val.studentProtections.map(k => `${k.student.lastName} ${k.student.firstName[0]}.${k.student.middleName[0]}.`),
            },
          ]
        : acc, []),
    }));

    return {
      group: group.name,
      protections: data,
    };
  }

  async downloadFileWithProtections(groupId: number) {
    const protectionsObj = await this.findProtectionsByGroupId(groupId);

    return downloadFile(protectionsObj.protections, protectionsObj.group);
  }

  async remove(id: number) {
    const theme = await this.protectionRepository.findOne(id);

    if (!theme) {
      throw new NotFoundException();
    }

    return this.protectionRepository.remove(theme);
  }
}
