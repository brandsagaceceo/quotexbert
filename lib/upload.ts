import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const s3ClientConfig: any = {
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
};

if (process.env.S3_ENDPOINT) {
  s3ClientConfig.endpoint = process.env.S3_ENDPOINT;
}

const s3Client = new S3Client(s3ClientConfig);

export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `portfolio/${nanoid()}-${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
  });

  await s3Client.send(command);
  
  // Return the public URL
  const endpoint = process.env.S3_ENDPOINT || `https://s3.${process.env.S3_REGION}.amazonaws.com`;
  return `${endpoint}/${process.env.S3_BUCKET_NAME}/${key}`;
}

export async function uploadMultipleImages(
  files: Array<{ buffer: Buffer; filename: string; contentType: string }>
): Promise<string[]> {
  const uploadPromises = files.map(file =>
    uploadImage(file.buffer, file.filename, file.contentType)
  );
  
  return Promise.all(uploadPromises);
}
