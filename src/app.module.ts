import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nest-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { AcademicDegreeModule } from './modules/academicDegree/academicDegree.module';
import { AcademicYearModule } from './modules/academicYear/academicYear.module';
import { DegreeModule } from './modules/degree/degree.module';
import { LaboratoryModule } from './modules/laboratory/laboratory.module';
import { LaboratoryDirectionModule } from './modules/laboratoryDirection/laboratoryDirection.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { GroupModule } from './modules/group/group.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { ThemeModule } from './modules/theme/theme.module';
import { TeacherLoadModule } from './modules/teacherLoad/teacherLoad.module';
import { RequestModule } from './modules/request/request.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { ExportModule } from './modules/export/export.module';

@Module({
  imports: [
    ConfigModule,
    MailerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.getDatabaseConfig(),
      inject: [ConfigService],
    }),
    UsersModule,
    AdminModule,
    AuthModule,
    DepartmentModule,
    GroupModule,
    AcademicDegreeModule,
    AcademicYearModule,
    DegreeModule,
    LaboratoryModule,
    LaboratoryDirectionModule,
    TeacherLoadModule,
    ThemeModule,
    RequestModule,
    ScheduleModule,
    SpecialtyModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
