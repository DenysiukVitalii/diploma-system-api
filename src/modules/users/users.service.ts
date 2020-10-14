import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { hash } from 'bcrypt';

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

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findAllUsersHeads(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: Roles.TEACHER, isHead: true },
      relations: ['department'],
    });
  }

  async createUser(createUserDto: CreateUserDto, role: Roles): Promise<User> {
    const department = await this.departmentRepository.findOne(createUserDto.departmentId);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const user = await this.usersRepository.create({
      ...createUserDto,
      role,
      isHead: createUserDto.isHead,
      department,
    });

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

  createHead(createUserDto: CreateUserDto): Promise<User> {
   return this.createUser(createUserDto, Roles.HEAD_OF_DEPARTMENT);
  }

  createPersonal(createUserDto: CreateUserDto): Promise<User> {
    return this.createUser(createUserDto, Roles.PERSONAL);
  }

  createTeacher(createUserDto: CreateUserDto): Promise<User> {
    return this.createUser(createUserDto, Roles.TEACHER);
  }

  createStudent(createUserDto: CreateUserDto): Promise<User> {
    return this.createUser(createUserDto, Roles.STUDENT);
  }

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
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    user.password = await hash(password, 10);
    user.isActive = true;

    return this.usersRepository.save(user);
  }
}
