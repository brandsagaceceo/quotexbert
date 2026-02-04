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
  // Validate S3 configuration
  const bucketName = process.env.S3_BUCKET_NAME;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME environment variable is not configured. Please contact support.');
  }

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('S3 credentials are not configured. Please contact support.');
  }

  // Use filename directly as it already includes the full path
  const key = filename;
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('[Upload] S3 upload failed:', error);
    throw new Error(`Failed to upload to storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Return the public URL
  if (process.env.S3_ENDPOINT) {
    // For custom endpoints (like R2, DigitalOcean Spaces)
    return `${process.env.S3_ENDPOINT}/${bucketName}/${key}`;
  } else {
    // For standard AWS S3
    return `https://${bucketName}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  }
}

export async function uploadMultipleImages(
  files: Array<{ buffer: Buffer; filename: string; contentType: string }>
): Promise<string[]> {
  const uploadPromises = files.map(file =>
    uploadImage(file.buffer, file.filename, file.contentType)
  );
  
  return Promise.all(uploadPromises);
}
