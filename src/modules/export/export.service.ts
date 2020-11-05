import { Injectable } from '@nestjs/common';
import { readFile } from '../../drive/readFile';
import { authorize } from '../../drive/auth';
import { getFile, getFolders, listFiles } from '../../drive';

@Injectable()
export class ExportService {
  constructor() {}

  async getFileFromDrive(fileId) {
    try {
      const data = await readFile('credentials.json');
      return new Promise((resolve, reject) => {
        authorize(JSON.parse(data), auth => {
          resolve(getFile(auth, fileId));
        });
      });
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  async getFilesFromDrive(folderId) {
    try {
      const data = await readFile('credentials.json');

      return new Promise((resolve, reject) => {
        authorize(JSON.parse(data), auth => {
          resolve(listFiles(auth, folderId));
        });
      });
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

  getFoldersFromDrive = async () => {
    try {
      const data = await readFile('credentials.json');

      return new Promise((resolve, reject) => {
        authorize(JSON.parse(data), auth => {
          resolve(getFolders(auth));
        });
      });
    } catch (e) {
      console.log('Error loading client secret file:', e);
    }
  }

}
