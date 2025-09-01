import { exec } from 'child_process';
import fs from 'fs';
import { supabase } from './supabaseclient.js';
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

    const fileStream = fs.createReadStream(tempPath);
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, fileStream, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'video/mp4',
        duplex: 'half'
      });

    if (uploadError) throw uploadError;

  
    const { data, error: urlError } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    const publicUrl = data.publicUrl;

    console.log('URL pública:', publicUrl);

    fs.unlinkSync(tempPath);

    return publicUrl;
  } catch (err) {
    console.error('Error en convertAndUpload:', err.message);
    return null;
  }
}
