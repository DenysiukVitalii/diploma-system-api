import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authorize } from '../../drive/auth';
import { getFile, getFolders, listFiles, uploadFile, studentFolder, deleteFile } from '../../drive';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class ExportService {
  credentials: object;

  constructor(private readonly configService: ConfigService) {
    this.credentials = this.configService.getGoogleDriveConfig();
  }

  auth() {
    return authorize(this.credentials);
  }

  async getFileFromDrive(fileId) {
    try {
      const auth = await this.auth();
      return getFile(auth, fileId);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  async getFilesFromDrive(folderId) {
    try {
      const auth = await this.auth();
      return listFiles(auth, folderId);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  getFoldersFromDrive = async () => {
    try {
      const auth = await this.auth();
      return getFolders(auth);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  uploadFileToDrive = async (file, folderId) => {
    if (!folderId) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Folder not found',
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      const auth = await this.auth();
      return uploadFile(auth, file, folderId);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  createStudentFolder = async (student, groupFolder) => {
    try {
      const auth = await this.auth();
      return studentFolder(auth, student, groupFolder);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  removeFileFromDrive = async (fileId) => {
    try {
      const auth = await this.auth();
      return deleteFile(auth, fileId);
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

}
