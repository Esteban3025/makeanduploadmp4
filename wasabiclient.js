import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

const wasabi = new S3Client({
  endpoint: 'http://s3.us-central-1.wasabisys.com/',
  region: 'us-central-1',
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

export default wasabi;