import { convertAndUpload } from './convertAndUpload.js';
import { supabase } from './supabaseclient.js';

async function populateSubreddit(subreddit, limit = 10) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/.json`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.children;

    for (const p of posts.slice(0, limit)) {
      const d = p.data;

    
      let hlsUrl = null;
      if (d.preview?.reddit_video_preview) {
        hlsUrl = d.preview.reddit_video_preview.hls_url;
      } else if (d.secure_media?.reddit_video?.hls_url) {
        hlsUrl = d.secure_media.reddit_video.hls_url;
      }

      
      let mp4Url = null;
      if (hlsUrl) {
        mp4Url = await convertAndUpload(hlsUrl, d.title);
      }

      const { error } = await supabase.from('videosclean').upsert([
        {
          id: d.name,
          title: d.title,
          subreddit: d.subreddit,
          url: mp4Url,
          created_utc: d.created_utc 
        }
      ], { onConflict: ['id'] });

      if (error) console.error('Error al insertar en DB:', error);
      else console.log(`${d.name} insertado con URL MP4:`, mp4Url);
    }

    console.log('Todos los posts procesados');
  } catch (err) {
    console.error('Error general:', err);
  }
}


populateSubreddit('Miinchojg', 5);
