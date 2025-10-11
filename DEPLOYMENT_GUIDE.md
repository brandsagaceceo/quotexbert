# QuoteXbert Production Deployment Guide

This guide covers deploying QuoteXbert to production using Vercel (recommended) or Netlify.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/quotexbert)

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.production` file or set these in your deployment platform:

```bash
# App Configuration
NEXT_PUBLIC_URL=https://your-domain.com
NODE_ENV=production

# Database (if using external database)
DATABASE_URL=your_production_database_url

# Authentication (Clerk - Optional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Email Notifications (Optional)
EMAIL_USER=your-smtp-username
EMAIL_PASS=your-smtp-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Payment Processing (Stripe - Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics (Optional)
NEXT_PUBLIC_CLARITY_ID=your_clarity_id
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# File Storage (if using cloud storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Rate Limiting & Security
RATE_LIMIT_SECRET=your_rate_limit_secret
JWT_SECRET=your_jwt_secret
```

### 2. Database Setup

#### Option A: Continue with SQLite (Simple)
- SQLite database will be bundled with your deployment
- Good for demos and small-scale applications
- No additional setup required

#### Option B: PostgreSQL (Recommended for Production)
```bash
# Install Prisma PostgreSQL adapter
npm install @prisma/client pg
npm install -D @types/pg

# Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Run migrations
npx prisma migrate deploy
```

### 3. File Storage Configuration

#### Option A: Local Storage (Current - Simple)
- Files stored in `/public/uploads/`
- Works for small applications
- Limited scalability

#### Option B: AWS S3 (Recommended for Production)
```typescript
// Update lib/upload.ts for S3 integration
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file: File, key: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file,
    ContentType: file.type,
  };
  
  return s3.upload(params).promise();
};
```

## 🔧 Vercel Deployment (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project root
vercel

# Follow the prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? Select your team/personal account
# - Link to existing project? [y/N] N
# - What's your project's name? quotexbert
# - In which directory is your code located? ./
```

### Step 4: Configure Environment Variables
```bash
# Add environment variables via Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_URL
vercel env add DATABASE_URL
# ... add all other environment variables
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

### Vercel Configuration (vercel.json)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/uploads/(.*)",
      "destination": "/api/uploads/$1"
    }
  ]
}
```

## 🌐 Netlify Deployment (Alternative)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build Configuration (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Deploy
```bash
# Login
netlify login

# Initialize project
netlify init

# Deploy
netlify deploy --prod
```

## 🔒 Security Configuration

### 1. Content Security Policy
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com *.clarity.ms;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: *.amazonaws.com;
              font-src 'self';
              connect-src 'self' *.vercel.com *.stripe.com;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

### 2. Rate Limiting
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring
```typescript
// lib/analytics.ts
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};
```

## 🗄️ Database Migrations

### Production Migration Script
```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Install dependencies
npm ci

# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Build application
npm run build

echo "Deployment complete!"
```

## 🔧 Performance Optimization

### 1. Next.js Configuration
```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['your-domain.com', 'your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};
```

### 2. Bundle Analysis
```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db pull
   ```

3. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Restart development server after adding new variables
   - Check Vercel/Netlify dashboard for proper configuration

4. **File Upload Issues**
   - Check file size limits (Vercel: 4.5MB, Netlify: 6MB)
   - Ensure proper CORS configuration for S3
   - Verify upload directory permissions

## ✅ Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] File uploads working
- [ ] Email notifications sending (if configured)
- [ ] Payment processing working (if configured)
- [ ] SSL certificate installed and working
- [ ] Domain name configured and working
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Performance monitoring set up
- [ ] Backup strategy implemented
- [ ] Rate limiting configured
- [ ] Security headers configured

## 📞 Support

For deployment issues:
1. Check the application logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test locally with production environment variables
4. Check the troubleshooting section above

Happy deploying! 🚀