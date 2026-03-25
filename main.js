import { convertAndUpload } from './convertAndUpload.js';

let lastPostId = null;

populateSubreddit('ClappingDemCheeks');

async function populateSubreddit(subreddit, limit = 10) { // podes toquetear el limite bajo tu propio riesgo
  try {
    const url = lastPostId 
    ? `https://www.reddit.com/r/${subreddit}/top/.json?limit=${limit}&after=${lastPostId}&t=week`
    : `https://www.reddit.com/r/${subreddit}/top/.json?limit=${limit}&t=week`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.children;

    if (posts.length > 0) {
      lastPostId = data.data.after; // guarda para la próxima
    }

    posts.map(e => {
      let rawData = e.data;
      let arrayOfTitles = [];
      let arrayOfUrls = [];

      arrayOfTitles.push(rawData.title);
      arrayOfUrls.push(rawData?.url_overridden_by_dest);

      for (let i = 0; i < arrayOfTitles.length; i++) {
        console.log("Title: ", arrayOfTitles[i], " Url: ", arrayOfUrls[i]);
        convertAndUpload(arrayOfUrls[i], arrayOfTitles[i]);
      }
    })

  } catch (err) {
    console.error('Error:', err);
  }
}



