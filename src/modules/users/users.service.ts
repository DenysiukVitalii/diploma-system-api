import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { CreateHeadDto } from '../admin/dto/create.head.dto';
import { Roles } from './enums/roles.enum';
import { Department } from '../department/department.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
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

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
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

    return head;
  }
}
