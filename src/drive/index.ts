import { HttpException } from '@nestjs/common';
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
