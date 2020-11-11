import { TeacherLoad } from '../teacherLoad.entity';
import { TeacherLoadInterface } from './teacherLoad.interface';
import { User } from '../../users/user.entity';

export interface TeacherLoadServiceInterface {
  findAll(user: User): Promise<TeacherLoadInterface[]>;
  create(data: TeacherLoadInterface, user: User): Promise<TeacherLoad>;
  update(id: number, data: TeacherLoadInterface): Promise<TeacherLoad>;
  delete(id: number): Promise<TeacherLoad>;
}
