import { convertAndUpload } from './convertAndUpload.js';
import { uploadImage } from './uploadImage.js';
import { supabase } from './supabaseclient.js';

let lastPostId = null;
let mediaType = "";

async function populateSubreddit(subreddit, limit = 10) {
  try {
    const url = lastPostId 
    ? `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}&after=${lastPostId}`
    : `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.children;

    if (posts.length > 0) {
      lastPostId = data.data.after; // guarda para la próxima
    }

    for (const p of posts.slice(0, limit)) {
      const d = p.data;
      let mediaUrl = null;
      console.log("daddy", d?.url_overridden_by_dest);
      if (d?.url_overridden_by_dest) {
        mediaUrl = await convertAndUpload(d.url, d.title);
        mediaType = "video";
      }
      // 2. Videos nativos de Reddit
      else if (d.preview?.reddit_video_preview?.hls_url || d.secure_media?.reddit_video?.hls_url) {
        const hlsUrl = d.preview?.reddit_video_preview?.hls_url || d.secure_media?.reddit_video?.hls_url;
        mediaUrl = await convertAndUpload(hlsUrl, d.title);
        mediaType = "video";
      }
      // 3. Imágenes directas
      else if (d.post_hint === 'image' && d.url.match(/\.(jpg|png|gif)$/i)) {
        mediaUrl = await uploadImage(d.url, d.title);
        mediaType = "image";
      }
      // 4. Galerías (toma la primera imagen)
      else if (d.gallery_data && d.media_metadata) {
        const firstImg = Object.values(d.media_metadata)[0];
        mediaUrl = await uploadImage(firstImg.s.u.replace(/&amp;/g, '&'), d.title);
        mediaType = "image";
      }
      // 5. Fallback a preview image
      else if (d.preview?.images?.[0]?.source?.url) {
        mediaUrl = await uploadImage(d.preview.images[0].source.url.replace(/&amp;/g, '&'), d.title);
        mediaType = "image";
      }

      if (mediaUrl) {
        const { error } = await supabase.from('videos').upsert([{
          id: d.name,
          title: d.title,
          subreddit: d.subreddit,
          url: mediaUrl,
          created_utc: d.created_utc,
          type: mediaType,
        }], { onConflict: ['id'] });

        if (error) console.error('Error DB:', error);
        else console.log(`✓ ${d.name}`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

populateSubreddit('BBC_Galore', 3);