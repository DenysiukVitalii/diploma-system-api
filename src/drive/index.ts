import { HttpException } from '@nestjs/common';
import { Readable } from 'stream';
const {google} = require('googleapis');

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function listFiles(auth, folderId) {
  const drive = google.drive({version: 'v3', auth});

  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
      q: `'${folderId}' in parents`,
    });
    return res.data.files;
  } catch (e) {
    console.log('The API returned an error: ' + e);
    throw new HttpException({
      status: e.response.status,
      error: e.response.data.error,
    }, e.response.status);
  }
}

/**
 * Get folders
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function getFolders(auth) {
  const drive = google.drive({version: 'v3', auth});

  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
      q: `mimeType='application/vnd.google-apps.folder'`,
    });
    return res.data.files;
  } catch (e) {
    console.log('The API returned an error: ' + e);
    throw new HttpException({
      status: e.response.status,
      error: e.response.data.error,
    }, e.response.status);
  }
}

export async function getFile(auth, fileId) {
  const drive = google.drive({ version: 'v3', auth });

  try {
    const res = await drive.files.get(
      { fileId, fields: '*', alt: 'media' },
      { responseType: 'blob' },
    );

    return res.data;
  } catch (e) {
    console.log('The API returned an error: ' + e);
    throw new HttpException({
      status: e.response.status,
      error: e.response.data.error,
    }, e.response.status);
  }
}

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}

export function uploadFile(auth, file, folderId) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: file.originalname,
    parents: [folderId],
  };
  const media = {
    mimeType: file.mimeType,
    body: bufferToStream(file.buffer),
  };
  drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  }, function (err, res) {
    if (err) {
      // Handle error
      console.log(err);
    } else {
      console.log('File Id: ', res.data.id);
    }
  });
}

export async function studentFolder(auth, student, groupFolder) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: `${student.lastName} (${student.email})`,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [groupFolder.id],
  };

  try {
    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });

    return folder.data;
  } catch (e) {
    console.log('The API returned an error: ' + e);
    throw new HttpException({
      status: e.response.status,
      error: e.response.data.error,
    }, e.response.status);
  }
}

export async function deleteFile(auth, fileId) {
  const drive = google.drive({ version: 'v3', auth });

  try {
    const res = await drive.files.delete({
      fileId,
    });

    if (res.status === 204) {
      return { message: 'File has been removed!' };
    }
  } catch (e) {
    console.log('The API returned an error: ' + e);
    throw new HttpException({
      status: e.response.status,
      error: e.response.data.error,
    }, e.response.status);
  }
}
