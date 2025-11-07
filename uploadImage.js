import  wasabi  from './wasabiclient.js';
import { PutObjectCommand  } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'imagesclean';
const WASABI_PUBLIC_URL = `http://s3.us-central-1.wasabisys.com/${BUCKET_NAME}`;

export async function uploadImage(imageUrl, title = 'image') {
  try {
    const sanitizeFilename = (title) => title.replace(/[^a-z0-9_*\-]/gi, '_');
    const fileName = `${sanitizeFilename(title)}_${Date.now()}.jpg`;

    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: `images/${fileName}`, // carpeta images
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    await wasabi.send(new PutObjectCommand(uploadParams));

    const publicUrl = `${WASABI_PUBLIC_URL}/images/${fileName}`;
    console.log('Imagen subida:', publicUrl);

    return publicUrl;
  } catch (err) {
    console.error('Error en uploadImage:', err.message);
    return null;
  }
}