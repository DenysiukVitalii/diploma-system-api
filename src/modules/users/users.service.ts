import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { hash } from 'bcrypt';

import { Pagination, paginateRepository } from '../../common/paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { CreateHeadDto } from '../admin/dto/create.head.dto';
import { Roles } from './enums/roles.enum';
import { Department } from '../department/department.entity';
import { Group } from '../group/group.entity';
import { Degree } from '../degree/degree.entity';
import { ApplicationMailerService } from '../mailer/mailer.service';
import { MessageType } from '../mailer/constants/mailer.constants';
import { jwtConstants } from '../auth/constants';
import { VerifyTokenDto } from '../auth/dto/verify.token.dto';
import { VerifyTokenInterface } from '../auth/interfaces/verify-token.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Degree)
    private readonly degreeRepository: Repository<Degree>,
    private readonly mailerService: ApplicationMailerService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.middleName = createUserDto.middleName;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email }});
  }

  findByEmailWithPassword(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findAllUsersHeads(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: Roles.TEACHER, isHead: true },
      order: { id: 'DESC' },
      relations: ['department'],
    });
  }

  async findAllUsersPersonals(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: Roles.PERSONAL },
      order: { id: 'DESC' },
      relations: ['department'],
    });
  }

  async findAllUsersStudents(query): Promise<Pagination<User>> {
    const { perPage = 1000, page = 1 } = query;
    return paginateRepository(this.usersRepository, { perPage, page }, {
      where: { role: Roles.STUDENT },
      order: { id: 'DESC' },
      relations: ['group'],
    });
  }

  async findAllUsersTeachers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: Roles.TEACHER },
      order: { id: 'DESC' },
      relations: ['degree'],
    });
  }

  async createUser(userData: object): Promise<User> {
    const user = await this.usersRepository.create(userData);

    await this.usersRepository.save(user);

    const token = sign({ email: user.email, verify: true }, jwtConstants.secret);

    await this.mailerService.sendMail(
      user.email,
      MessageType.NewUser,
      {
        role: user.role,
        verifyLink: `https://diploma-system-app.herokuapp.com/verify/?token=${token}`,
      },
    );

    return user;
  }

  async resetPassword(resetPasswordData: ResetPasswordDto): Promise<User> {
    const user = await this.findByEmail(resetPasswordData.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = sign({ email: user.email, verify: true }, jwtConstants.secret);
    Logger.log("RECOVER TOKEN");
    Logger.log(token);

    await this.mailerService.sendMail(
      user.email,
      MessageType.PasswordReset,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        resetLink: `https://diploma-system-app.herokuapp.com/recover-password/?token=${token}`,
      },
    );

    return user;
  }

  async recoverPassword(recoverPasswordData: RecoverPasswordDto): Promise<User> {
    // @ts-ignore
    const { email } = verify(recoverPasswordData.token, jwtConstants.secret);
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await hash(recoverPasswordData.password, 10);
    user.isActive = true;

    return this.usersRepository.save(user);
  }

  async createHead(createHeadDto: CreateHeadDto): Promise<User> {
    const department = await this.departmentRepository.findOne(createHeadDto.departmentId);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const head = {
      ...createHeadDto,
      role: Roles.TEACHER,
      isHead: true,
      department,
    };
    return this.createUser(head);
  }

  async updateHead(id: number, data: CreateHeadDto): Promise<User> {
    const head = await this.usersRepository.findOne({
      where: { id, role: Roles.TEACHER, isHead: true },
      relations: ['department'],
    });

    if (!head) {
      throw new NotFoundException();
    }

    return this.usersRepository.save({ ...head, ...data });
  }

  async deleteHead(id: number) {
    const head = await this.usersRepository.findOne({
      where: { id, role: Roles.TEACHER, isHead: true },
    });

    if (!head) {
      throw new NotFoundException();
    }

    return this.usersRepository.remove(head);
  }

  createPersonal(createUserDto: CreateUserDto, departmentId: number): Promise<User> {
    const personal = {
      ...createUserDto,
      role: Roles.PERSONAL,
      department: { id: departmentId },
    };
    return this.createUser(personal);
  }

  async updatePersonal(id: number, data: CreateUserDto): Promise<User> {
    const personal = await this.usersRepository.findOne({
      where: { id, role: Roles.PERSONAL },
    });

    if (!personal) {
      throw new NotFoundException();
    }

    return this.usersRepository.save({ ...personal, ...data });
  }

  async deletePersonal(id: number) {
    const personal = await this.usersRepository.findOne({
      where: { id, role: Roles.PERSONAL },
    });

    if (!personal) {
      throw new NotFoundException();
    }

    return this.usersRepository.remove(personal);
  }

  async createTeacher(createTeacherDto: CreateTeacherDto, departmentId: number): Promise<User> {
    const degree = await this.degreeRepository.findOne(createTeacherDto.degreeId);

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    const teacher = {
      ...createTeacherDto,
      role: Roles.TEACHER,
      department: { id: departmentId },
      degree,
    };
    return this.createUser(teacher);
  }

  async updateTeacher(id: number, data: CreateTeacherDto): Promise<User> {
    const teacher = await this.usersRepository.findOne({
      where: { id, role: Roles.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException();
    }

    const degree = await this.degreeRepository.findOne(data.degreeId);

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    return this.usersRepository.save({ ...teacher, ...data, degree });
  }

  async deleteTeacher(id: number) {
    const teacher = await this.usersRepository.findOne({
      where: { id, role: Roles.TEACHER },
    });

    if (!teacher) {
      throw new NotFoundException();
    }

    return this.usersRepository.remove(teacher);
  }

  async createStudent(createStudentDto: CreateStudentDto, departmentId: number): Promise<User> {
    const group = await this.groupRepository.findOne(createStudentDto.groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const student = {
      ...createStudentDto,
      role: Roles.STUDENT,
      department: { id: departmentId },
      group,
    };
    return this.createUser(student);
  }

  async updateStudent(id: number, data: CreateStudentDto): Promise<User> {
    const student = await this.usersRepository.findOne({
      where: { id, role: Roles.STUDENT },
    });

    if (!student) {
      throw new NotFoundException();
    }

    const group = await this.groupRepository.findOne(data.groupId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.usersRepository.save({ ...student, ...data, group });
  }

  async deleteStudent(id: number) {
    const student = await this.usersRepository.findOne({
      where: { id, role: Roles.STUDENT },
    });

    if (!student) {
      throw new NotFoundException();
    }

    return this.usersRepository.remove(student);
  }

  // todo move jwtConstants.secret to env
  async verifyToken(verifyTokenDto: VerifyTokenDto): Promise<VerifyTokenInterface> {
    // @ts-ignore
    const { email } = verify(verifyTokenDto.token, jwtConstants.secret);
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    return { verified: user.isActive, email };
  }

  async signUp(data: object) {
    // @ts-ignore
    const { email, password } = data;
    const user = await this.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException();
    }

    user.password = await hash(password, 10);
    user.isActive = true;

    return this.usersRepository.save(user);
  }
}
