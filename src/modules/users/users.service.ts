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
      where: { role: Roles.HEAD_OF_DEPARTMENT },
      relations: ['department'],
    });
  }

  async createHead(createHeadDto: CreateHeadDto): Promise<User> {
    const department = await this.departmentRepository.findOne(createHeadDto.departmentId);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const head = await this.usersRepository.create({
      ...createHeadDto,
      role: Roles.HEAD_OF_DEPARTMENT,
      department,
    });

    await this.usersRepository.save(head);

    const token = sign({ email: head.email, verify: true }, jwtConstants.secret);

    await this.mailerService.sendMail(
      head.email,
      MessageType.NewUser,
      {
        role: head.role,
        verifyLink: `https://diploma-system-app.herokuapp.com/verify/?token=${token}`,
      },
    );

    return head;
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
