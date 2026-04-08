import { convertAndUpload } from './convertAndUpload.js';
import fs from 'node:fs/promises';

let after = null;
let afterFileExist = null;

<<<<<<< HEAD
populateSubreddit('Paraguay', 5);

async function populateSubreddit(subreddit, limit = 15) { // podes toquetear el limite bajo tu propio riesgo
  let lastPostId;
=======
populateSubreddit('Paraguay');
>>>>>>> 78a6f33179c9d06a900d6b3b2aa71842c93184aa

  try {
    await fs.access('./tmp/after.txt');
    console.log('El archivo existe');
    afterFileExist = true;
    lastPostId = await ReadAfterFile();
    console.log("Este es el after anterior: ", lastPostId);
  } catch (error) {
    console.log('El archivo no existe');
    afterFileExist = false;
  }

  try {
    const url = afterFileExist
    ? `https://www.reddit.com/r/${subreddit}/.json?limit=${limit}&after=${lastPostId}`
    : `https://www.reddit.com/r/${subreddit}/.json?limit=${limit}&t=best`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.data.children;

    after = await data.data.after; // guarda para la próxima

    await WriteAfterFile(after);

    console.log("Este es el nuevo after: ", after);

    let arrayOfTitles = [];
    let arrayOfUrls = [];

    posts.map(e => {
      let rawData = e.data;
      arrayOfTitles.push(rawData.title);
      arrayOfUrls.push(rawData?.url_overridden_by_dest);

      for (let i = 0; i < arrayOfTitles.length; i++) {
        console.log("Title: ", arrayOfTitles[i], " Url: ", arrayOfUrls[i]);
        convertAndUpload(arrayOfUrls[i], arrayOfTitles[i]);
      }
      
    })
    console.log("Cantidad de videos: ", arrayOfUrls.length);

  } catch (err) {
    console.error('Error:', err);
  }
}


// Escribir en txt
async function WriteAfterFile(after) {
  try {
    const content = `${after}`;
    await fs.writeFile('./tmp/after.txt', content);
  } catch (err) {
    console.log(err);
  }
}

// Leer un archivo
async function ReadAfterFile() {
  try {
    const data = await fs.readFile("./tmp/after.txt", { encoding: 'utf8' });
    return data;
  } catch (err) {
    console.log(err);
  }
  
}