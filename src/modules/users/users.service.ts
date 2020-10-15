import { Injectable, NotFoundException } from '@nestjs/common';
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
import { ApplicationMailerService } from '../mailer/mailer.service';
import { MessageType } from '../mailer/constants/mailer.constants';
import { jwtConstants } from '../auth/constants';
import { VerifyTokenDto } from '../auth/dto/verify.token.dto';
import { VerifyTokenInterface } from '../auth/interfaces/verify-token.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
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

  async findAllUsersHeads(query): Promise<Pagination<User>> {
    const { perPage = 10, page = 1 } = query;
    return paginateRepository(this.usersRepository, { perPage, page }, {
      where: { role: Roles.TEACHER, isHead: true },
      order: { id: 'DESC' },
      relations: ['department'],
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

  // todo get department from user
  createPersonal(createUserDto: CreateUserDto): Promise<User> {
    const personal = {
      ...createUserDto,
      role: Roles.PERSONAL,
    };
    return this.createUser(personal);
  }

  // todo get department from user and add in request another data
  createTeacher(createUserDto: CreateUserDto): Promise<User> {
    const teacher = {
      ...createUserDto,
      role: Roles.TEACHER,
    };
    return this.createUser(teacher);
  }

  // todo get department from user and add in request another data
  createStudent(createUserDto: CreateUserDto): Promise<User> {
    const student = {
      ...createUserDto,
      role: Roles.STUDENT,
    };
    return this.createUser(student);
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

  // todo get user with password
  async signUp(data: object) {
    // @ts-ignore
    const { email, password } = data;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    user.password = await hash(password, 10);
    user.isActive = true;

    return this.usersRepository.save(user);
  }
}
