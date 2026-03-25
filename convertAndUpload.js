import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

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
  } catch (err) {
    console.error('Error en convertAndUpload:', err.message);
    return null;
  }
}
