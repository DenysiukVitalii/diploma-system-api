import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
// import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
  ],
  providers: [AdminService],
  exports: [AdminService],
  // controllers: [AdminController],
})
export class AdminModule {}
