import { supabase } from './supabaseclient.js';

export async function uploadImage(imageUrl, title = 'image') {
  try {
    const sanitizeFilename = (title) => title.replace(/[^a-z0-9_*\-]/gi, '_');
    const fileName = `${sanitizeFilename(title)}_${Date.now()}.jpg`;

    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from('imagesclean') // mismo bucket o crea uno nuevo
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg'
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('imagesclean')
      .getPublicUrl(fileName);

    console.log('Imagen subida:', data.publicUrl);
    return data.publicUrl;
  } catch (err) {
    console.error('Error en uploadImage:', err.message);
    return null;
  }
}