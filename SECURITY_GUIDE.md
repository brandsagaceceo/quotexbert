# 🔐 QuoteXpert Production Security Guide

## 🚨 CRITICAL: Before Going Live

### 1. Environment Variables Security
**NEVER commit these to Git:**

```bash
# .env.local (keep this file LOCAL only)
NODE_ENV=production

# Database - Use PostgreSQL in production
DATABASE_URL="postgresql://user:password@host:5432/quotexpert_prod?sslmode=require"

# Authentication
CLERK_SECRET_KEY="sk_live_your_actual_secret"
NEXTAUTH_SECRET="your-super-secure-random-string-32-chars-minimum"

# Email Service (use SendGrid, Mailgun, or SES)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"

# Payments (Stripe Live Keys)
STRIPE_SECRET_KEY="sk_live_your_stripe_secret"
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_public"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
S3_BUCKET_NAME="quotexpert-uploads-prod"
AWS_REGION="us-east-1"

# Security
BCRYPT_ROUNDS=12
JWT_SECRET="your-jwt-secret-256-bits-minimum"
ENCRYPTION_KEY="your-encryption-key-32-bytes"
```

### 2. Database Security

#### Migrate from SQLite to PostgreSQL
```bash
# Install PostgreSQL adapter
npm install @prisma/client prisma pg @types/pg

# Update schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Run migration
npx prisma db push
npx prisma generate
```

#### Database Security Settings
```sql
-- Create production database with proper permissions
CREATE DATABASE quotexpert_prod OWNER quotexpert_user;
GRANT CONNECT ON DATABASE quotexpert_prod TO quotexpert_user;
GRANT USAGE ON SCHEMA public TO quotexpert_user;
GRANT CREATE ON SCHEMA public TO quotexpert_user;

-- Enable SSL
ALTER SYSTEM SET ssl = on;
```

### 3. File Upload Security

#### Move to AWS S3
```typescript
// lib/s3.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(file: Buffer, key: string, contentType: string) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
    ACL: 'private', // Never make uploads public
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

export function getSignedUrl(key: string) {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Expires: 3600, // 1 hour
  });
}
```

#### S3 Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDirectPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::quotexpert-uploads-prod/*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalServiceName": "cloudfront.amazonaws.com"
        }
      }
    }
  ]
}
```

### 4. Next.js Security Configuration

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com;"
          }
        ]
      }
    ];
  },

  // Image optimization security
  images: {
    domains: ['quotexpert-uploads-prod.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
  },

  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
```

### 5. API Security

#### Rate Limiting
```typescript
// lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'));
        } else {
          resolve();
        }
      }),
  };
}

// Usage in API routes
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Limit each IP to 500 requests per interval
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  
  try {
    await limiter.check(10, ip); // 10 requests per minute per IP
  } catch {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Your API logic here
}
```

### 6. Authentication Security

#### Secure Session Configuration
```typescript
// lib/auth-config.ts
export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
```

### 7. Input Validation & Sanitization

#### Zod Schemas for Validation
```typescript
// lib/validation.ts
import { z } from 'zod';

export const createLeadSchema = z.object({
  title: z.string().min(5).max(100).regex(/^[a-zA-Z0-9\s\-_.,!?]+$/),
  description: z.string().min(20).max(2000),
  projectType: z.enum(['bathroom', 'kitchen', 'roofing', 'flooring', 'painting', 'plumbing', 'electrical', 'other']),
  budget: z.number().min(100).max(1000000),
  location: z.string().min(5).max(100),
  photos: z.array(z.string().url()).max(10).optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  recipientId: z.string().uuid(),
  attachments: z.array(z.string().url()).max(5).optional(),
});
```

### 8. Deployment Security

#### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NODE_ENV production
vercel env add DATABASE_URL [your-production-db-url]
# ... add all production env vars
```

#### Self-Hosted Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 9. Monitoring & Logging

#### Error Tracking with Sentry
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### 10. SSL/HTTPS Configuration

#### Force HTTPS
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  return NextResponse.next();
}
```

## 🛡️ Security Checklist

### Pre-Launch Security Audit
- [ ] All environment variables secured
- [ ] Database migrated to PostgreSQL with SSL
- [ ] File uploads moved to S3 with private buckets
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Rate limiting implemented on all API routes
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Security headers configured
- [ ] Error handling doesn't leak sensitive data
- [ ] Logging and monitoring setup
- [ ] Regular security updates scheduled

### Post-Launch Monitoring
- [ ] Set up security alerts
- [ ] Monitor for suspicious activity
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Penetration testing
- [ ] Backup verification
- [ ] Disaster recovery plan

## 🚨 Emergency Response

### Security Incident Response
1. **Immediate**: Take affected systems offline
2. **Assess**: Determine scope of breach
3. **Contain**: Prevent further damage
4. **Investigate**: Find root cause
5. **Recover**: Restore secure operations
6. **Learn**: Update security measures

### Emergency Contacts
- Database Admin: [contact]
- Security Team: [contact]
- Legal: [contact]
- Insurance: [contact]

Remember: Security is ongoing, not a one-time setup!