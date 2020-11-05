import { Controller, Get, Param, Res } from '@nestjs/common';
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

  @Get('file/:fileId')
  async getFile(@Res() res, @Param('fileId') fileId) {
    const blob: any = await this.exportService.getFileFromDrive(fileId);

    res.type(blob.type);
    blob.arrayBuffer().then((buf) => {
      res.send(Buffer.from(buf));
    });
  }
}
