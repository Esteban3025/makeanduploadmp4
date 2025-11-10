import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import  wasabi  from './wasabiclient.js';
import { PutObjectCommand  } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'videosclean';
const WASABI_PUBLIC_URL = `http://s3.us-central-1.wasabisys.com/${BUCKET_NAME}`;

export async function convertAndUpload(hlsUrl, title = 'video') {
  try {
    const tmpDir = path.join('./tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const sanitizeFilename = (title) => title.replace(/[^a-z0-9_*\-]/gi, '_');
    const fileName = `${sanitizeFilename(title)}_${Date.now()}.mp4`;
    const tempPath = path.join(tmpDir, fileName);

    await new Promise((resolve, reject) => {
      const command = `yt-dlp "${hlsUrl}" --merge-output-format mp4 -o "${tempPath}"`;
      exec(command, (err, stdout, stderr) => {
        if (err) return reject(err);
        console.log(stdout);
        resolve();
      });
    });

    console.log('Conversión completada:', tempPath);

    // const fileContent = fs.readFileSync(tempPath);
    // const uploadParams = {
    //   Bucket: BUCKET_NAME,
    //   Key: `videos/${fileName}`, // carpeta videos
    //   Body: fileContent,
    //   ContentType: 'video/mp4',
    //   ACL: 'public-read', // hacer público
    // };

    // await wasabi.send(new PutObjectCommand(uploadParams));

    // const publicUrl = `${WASABI_PUBLIC_URL}/videos/${fileName}`;
    // console.log('URL pública:', publicUrl);

    fs.unlinkSync(tempPath);

    return publicUrl;
  } catch (err) {
    console.error('Error en convertAndUpload:', err.message);
    return null;
  }
}
