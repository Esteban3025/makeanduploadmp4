# Reddit Media Downloader and Storage
This is a simple tool to scrape videos and images from any subreddit you want.
To store the data, I prefer uploading it to a Supabase bucket. The code converts the video link into another URL stored in your database and bucket.
You can store the files wherever you want, but by default this is the flow. You don’t need to do anything—just change the names, and that’s it.

----

## Prerequisites
- **Node.js**
-  **ffmpeg**
- **NPM**

---

## Installation

First of all, you need to have FFmpeg installed on your computer to convert hls videos to mp4.

- Mac: `brew install ffmpeg`

- Windows: Step by Step guide [here](https://phoenixnap.com/kb/ffmpeg-windows)

- Linux: Step by Step guide [here](https://phoenixnap.com/kb/install-ffmpeg-ubuntu)

---

## Configuration

1. Install dependencies:
```bash

npm install

```
---

## Storage with Supabase

1.  **Setup Supabase**

- Create a new project in [Supabase](https://supabase.com)

- Create a bucket with the name `videoclean` in the Storage, you can change the name if you want, but remember you need to change it in the code too.
- Create a table  `videos` with the following structure 

```sql
CREATE TABLE Videos (
	id text primary key,
	title varchar,
	subreddit varchar,
	url varchar,
	create_utc timestamp
);
```
---

## Usage

1. **Configuration example `populateRedditVideos.js`:**
```javascript
/* Here you can type the name of the subreddit you want, and the amount of post you want to extract, if it’s set to zero, the default limit will be 10.*/
populateSubreddit('nameofthesubreddit', 10);
```

2.  **Run the code**
```bash
# When you setup everything, you can run the script like this
node populateRedditVideos.js
```  

---

## Tips

 1. Change the storage names:

- You can change the name of the bucket of `videosclean` en `convertAndUpload.js` and `uploadImage.js`

---

# Español

# Reddit Media Downloader and Storage

Esta es una herramienta facil para descargar videos e imágenes de cualquier subreddit que quieras.  
Por defecto, los archivos se guardan en un bucket de Supabase. El código convierte los enlaces originales de los videos en nuevas URLs, que quedan almacenadas tanto en tu base de datos como en tu bucket.

Podés usar cualquier otro sistema de almacenamiento si querés, pero este es el flujo por defecto. No tenés que hacer casi nada, solo cambiar algunos nombres si lo necesitás.

---

## Requisitos previos

- **Node.js**  
- **ffmpeg**  
- **NPM**

---

## Instalación

Primero que todo tenes que tener instalado ffmpeg en tu computadora, aca te dejo un par de tutoriales paso a paso, es re facil y rapido, esto se encarga de convertir videos hls a mp4.

- **Mac:** `brew install ffmpeg`  
- **Windows:** Guía paso a paso [aquí](https://phoenixnap.com/kb/ffmpeg-windows)  
- **Linux:** Guía paso a paso [aquí](https://phoenixnap.com/kb/install-ffmpeg-ubuntu)

---

## Configuración

1. Instalar dependencias:

```bash
npm install
```

---

## Almacenamiento con Supabase

1. **Configurar Supabase**

- Crear un nuevo proyecto en [Supabase](https://supabase.com)
- Crear un bucket llamado `videoclean` en la sección de Storage.  
  (Podés cambiar el nombre, pero acordate de actualizarlo también en el código.)
- Crear una tabla `videos` con la siguiente estructura:

```sql
CREATE TABLE Videos (
	id text primary key,
	title varchar,
	subreddit varchar,
	url varchar,
	create_utc timestamp
);
```

---

## Uso

1. **Ejemplo de configuración en `populateRedditVideos.js`:**

```javascript
/* Acá podés poner el nombre del subreddit y la cantidad de posts que querés descargar.
   Si ponés cero, el límite por defecto va a ser 10. */
populateSubreddit('nombreDelSubreddit', 10);
```

2. **Ejecutar el script:**

```bash
# Cuando tengas todo configurado, corré el script así:
node populateRedditVideos.js
```

---

## Tips

1. **Cambiar los nombres del almacenamiento:**

   Podés modificar el nombre del bucket `videosclean` en los archivos `convertAndUpload.js` y `uploadImage.js`.
