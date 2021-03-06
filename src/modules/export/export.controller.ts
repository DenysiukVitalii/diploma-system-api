import { Controller, Delete, Get, Header, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../users/decorators/auth.decorator';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Roles } from '../users/enums/roles.enum';
import { User } from '../users/user.entity';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('folders')
  getFolders(): Promise<any> {
    return this.exportService.getFoldersFromDrive();
  }

  @Get('files/:folderId')
  getFiles(@Param('folderId') folderId): Promise<any> {
    return this.exportService.getFilesFromDrive(folderId);
  }

  @Post('file/:fileId')
  async getFile(@Res() res, @Param('fileId') fileId) {
    const blob: any = await this.exportService.getFileFromDrive(fileId);

    res.type(blob.type);
    blob.arrayBuffer().then((buf) => {
      res.send(Buffer.from(buf));
    });
  }

  @Auth(Roles.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  @Post('student/upload')
  public async uploadStudentFileToDrive(
    @UploadedFile() file,
    @CurrentUser() user: User,
  ) {
    const folders: any = await this.exportService.getFoldersFromDrive();
    const groupFolder = folders.find(i => i.name === user.group.name);
    let studentFolder = folders.find(i => i.name === `${user.lastName} (${user.email})`);

    if (!studentFolder) {
      studentFolder = await this.exportService.createStudentFolder(user, groupFolder);
      await this.exportService.uploadFileToDrive(file, studentFolder.id);
      return {
        message: 'File uploaded',
      };
    } else {
      const studentFiles = await this.getFiles(studentFolder.id);
      if (studentFiles.length === 1) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Student already has file',
        }, HttpStatus.BAD_REQUEST);
      }
      await this.exportService.uploadFileToDrive(file, studentFolder.id);
      return {
        message: 'File uploaded',
      };
    }
  }

  @Auth(Roles.STUDENT)
  @Get('student/files')
  async getMyStudentFiles(@CurrentUser() user: User) {
    const folders: any = await this.exportService.getFoldersFromDrive();
    const folder = folders.find(i => i.name === `${user.lastName} (${user.email})`);

    return this.exportService.getFilesFromDrive(folder.id);
  }

  @Delete('file/:fileId')
  async deleteFileFromDrive(@Param('fileId') fileId: number) {
    return this.exportService.removeFileFromDrive(fileId);
  }
}
