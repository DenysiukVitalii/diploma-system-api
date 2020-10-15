import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { Theme } from './theme.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Theme]),
  ],
  providers: [ThemeService],
  exports: [ThemeService],
  controllers: [ThemeController],
})
export class ThemeModule {}
