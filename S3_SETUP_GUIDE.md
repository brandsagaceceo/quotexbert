# Quick S3 Setup for Photo Uploads

## Option 1: Use Vercel Blob (Easiest - Recommended)

Vercel Blob is simpler and already integrated. Let's switch to it:

### Step 1: Enable Vercel Blob
1. Go to https://vercel.com/
2. Click your **quotexbert** project
3. Click **Storage** tab
4. Click **Create Database** → Select **Blob**
5. Click **Create**
6. Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment

### Step 2: Update the upload code
I'll modify the upload.ts file to use Vercel Blob instead of S3.

---

## Option 2: Use AWS S3 (If you prefer)

### Step 1: Create S3 Bucket
1. Go to https://console.aws.amazon.com/s3/
2. Click **Create bucket**
3. Bucket name: `quotexbert-uploads`
4. Region: `us-east-1`
5. Uncheck "Block all public access"
6. Check "I acknowledge..."
7. Click **Create bucket**

### Step 2: Set Bucket Policy
1. Click on your bucket
2. Go to **Permissions** tab
3. Scroll to **Bucket policy**
4. Click **Edit** and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::quotexbert-uploads/*"
    }
  ]
}
```

### Step 3: Create IAM User
1. Go to https://console.aws.amazon.com/iam/
2. Click **Users** → **Create user**
3. Username: `quotexbert-uploader`
4. Click **Next**
5. Select **Attach policies directly**
6. Search for `AmazonS3FullAccess` and check it
7. Click **Next** → **Create user**

### Step 4: Create Access Key
1. Click on the user you just created
2. Go to **Security credentials** tab
3. Click **Create access key**
4. Select **Application running outside AWS**
5. Click **Next** → **Create access key**
6. **SAVE THESE** (you can't see them again):
   - Access key ID
   - Secret access key

---

## Which should you choose?

**Use Vercel Blob if:**
- You want the simplest setup (recommended)
- You don't already have AWS configured
- You want it working in 2 minutes

**Use AWS S3 if:**
- You already have AWS account set up
- You need more control
- You prefer AWS infrastructure
