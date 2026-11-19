# QuoteXbert - Complete Home Improvement Platform

<div align="center">

![QuoteXbert Logo](public/branding/quotexbert-qx-icon-display.webp)

**AI-Powered Home Repair Estimates & Contractor Matching Platform**

**🔒 Now with Clerk Authentication & Enhanced Security**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/quotexbert)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[Live Site](https://www.quotexbert.com) · [Documentation](./docs/) · [Report Bug](https://github.com/yourusername/quotexbert/issues) · [Request Feature](https://github.com/yourusername/quotexbert/issues)

</div>

## 🌟 What is QuoteXbert?

QuoteXbert is a comprehensive home improvement platform that connects homeowners with verified contractors. The platform features AI-powered estimate generation, Clerk authentication with Google OAuth, real-time messaging, secure payments, and mobile-optimized experiences.

### 🎯 Key Features

- **🏠 For Homeowners:**
  - Post home improvement projects
  - Get AI-powered instant estimates
  - Find and connect with verified contractors
  - Secure messaging and file sharing
  - Safe payment processing with milestone tracking
  - Review and rating system

- **🔨 For Contractors:**
  - Browse available jobs in your area
  - Submit competitive quotes
  - Build professional portfolios
  - Direct communication with homeowners
  - Subscription-based lead access
  - Secure payment processing

- **📱 Platform Features:**
  - Mobile-first responsive design
  - Real-time notifications
  - File upload and management
  - Email notification system
  - Advanced search and filtering
  - Payment integration (Stripe)
  - Demo mode for testing

## 🚀 Quick Start

### Approved QX branding

The original PNG artwork in [public/branding](./public/branding/) is preserved.
The shared header and footer use lossless WebP display copies, with only transparent
margins trimmed and a one-pixel transparent border added. There is no resizing,
lettering reconstruction, or lossy compression.

Regenerate only these display copies with `node scripts/optimize-branding.mjs`.
Validate pixel preservation and download savings with
`node --test scripts/branding-assets.test.mjs`.
Convert browser favicons and web app icons directly from the approved square PNG
with `node scripts/generate-favicons.mjs`; the same focused test verifies all
output pixels against direct master resizes, including embedded PNGs in the
legacy SVG URLs and ICO frames. Existing icon URLs remain compatible; versioned
metadata/manifest references refresh older browser caches. Manifest icons use
`purpose: any`: a maskable redesign is deliberately not claimed.
Social exports and native App Store assets remain outside this update.

### Existing AI Blog Studio

`/admin/blog` now uses the existing database-backed SEO editor; `/admin/blog/seo`
redirects there for compatibility. Counts and status filters use `SeoArticle`,
not sample posts or invented analytics. The existing list API is paginated
(25 records per page); response summaries cover all records.

All generation stays private. Manual generation uses the same generator, approved
topics, shared one-attempt-per-UTC-day reservation, and global AI request budget
as scheduled drafting. It requires `SEO_MANUAL_DRAFT_ENABLED=true`; this package
does not enable the flag or make paid AI requests. Non-production writes also
require `SEO_PREVIEW_WRITES_ENABLED=true`, **only after** an authorized isolated
database is configured with the existing migration. Preview publication remains
blocked. No migration or environment change is performed by this package.

Approval never publishes, and editing an approved article clears its approval.
Cron can draft when explicitly enabled but cannot publish, even if the old
`SEO_AUTO_PUBLISH_ENABLED` variable remains configured. Publication is only
through the existing, explicitly confirmed administrator publish action.

The Search Console panel links to the existing sitemap and reports setup status,
not search metrics. `GOOGLE_SITE_VERIFICATION` optionally supplies the existing
layout's HTML verification tag; the placeholder token was removed. Google
ownership verification and separately authorized API access are still required.

Focused, isolated tests (no real database, email or AI calls):
`npx tsx --test scripts/seo-admin-authorization.test.ts scripts/seo-content-validation.test.ts scripts/seo-cron-safety.test.ts scripts/seo-manual-generation.test.ts`.

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quotexbert.git
   cd quotexbert
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Production: Navigate to [https://www.quotexbert.com](https://www.quotexbert.com)
   - Local Dev: Navigate to [http://localhost:3000](http://localhost:3000)

### Private homeowner photo storage

Connect a **private** Vercel Blob store before enabling homeowner photo uploads. Private uploads, reads, and deletes use Vercel OIDC and explicitly select the connected private store; they fail closed if the OIDC token or expected store ID is unavailable. The Production connection currently exposes its private store as `BLOB_STORE_ID`; Preview uses `PRIVATE_BLOB_STORE_ID` for its separate test store. Do not pass `BLOB_READ_WRITE_TOKEN` to private operations. Keep that existing token configured for intentionally public profile, logo, and portfolio uploads. The private-photo API checks the signed-in owner and grants contractors access only when a published lead is visible to them.

Existing public Blob URLs are not changed by this code and remain publicly accessible until they are separately migrated and revoked.

## 🏗️ System Architecture

### Tech Stack

- **Frontend:** Next.js 15.4.6, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (development), PostgreSQL (production)
- **Authentication:** Custom demo auth (Clerk integration ready)
- **Payments:** Stripe integration
- **File Storage:** Local uploads (S3 integration ready)
- **Email:** SMTP with HTML templates
- **Deployment:** Vercel/Netlify ready

### Project Structure

```
quotexbert/
├── app/                     # Next.js 13+ App Router
│   ├── api/                 # API routes
│   ├── (auth)/             # Authentication pages
│   ├── admin/              # Admin dashboard
│   ├── contractor/         # Contractor-specific pages
│   ├── homeowner/          # Homeowner-specific pages
│   └── ...                 # Other pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── styles/                 # Global styles and CSS
└── docs/                   # Documentation
```

## 📖 Core Features Documentation

### 1. User Management & Authentication
- Existing Clerk sign-in and sign-up
- Role-based access (homeowner/contractor)
- Profile management with image uploads
- Existing database-backed account and role resolution

### 2. Job & Quote Management
- Job posting with AI estimate generation
- Quote submission and comparison
- Status tracking and updates
- File attachments support

#### Estimate authentication handoff

The existing homepage and estimate landing page retain `/create-lead` as the
sign-up/sign-in return destination. Browser storage failures are reported before
navigation rather than claiming that an estimate was preserved.

The existing `pending_save_estimate` cache is cleared only after the existing
save API confirms a saved record. Failed requests, malformed responses and newer
queued estimates are retained. The client shares in-flight resume requests and
adds a durable `clientRequestId` before posting, including for legacy caches.
The existing save API uses that optional UUID as the existing `AIEstimate.id`:
retries return the same owner-checked record without updating it; concurrent
creation is handled. Callers without this optional field keep their previous
create behavior. No new model, migration, API or authentication flow is added.

Focused tests: `npx tsx --test scripts/estimate-handoff.test.ts scripts/homeowner-estimate-project-security.test.ts`.
They exercise the client-to-existing-API retry workflow with in-memory records
only, including a response lost after commit. Real Clerk/database/photo-upload
acceptance still requires an authorized isolated environment.

### 3. Messaging System
- Real-time conversations
- File sharing capabilities
- Read receipts and notifications
- Mobile-optimized chat interface

### 4. Subscription Billing
- Stripe integration for contractor subscription billing
- Plan management for contractor access
- Billing status and renewal tracking
- Subscription lifecycle webhooks

### 5. Portfolio Management
- Contractor portfolio uploads
- Image management and optimization
- Project showcases
- Performance analytics

### 6. Search & Discovery
- Advanced contractor search
- Filter by location, trade, rating
- Verified contractor badges
- Review-based ranking

### 7. Mobile Experience
- Progressive Web App features
- Bottom navigation for mobile
- Touch-optimized interfaces
- Swipe gestures and interactions

#### Homepage banner motion

The existing homepage banners reuse the shared `gradient`/`blob` animations and
the existing burgundy CSS brand tokens. `.homepage-banner` slows the decorative
gradient to 12 seconds without moving text or controls. Existing reduced-motion
rules disable these loops; the estimate CTA also uses the shared scroll-motion
preference. Routes, role visibility, offer flags and pricing behavior are
unchanged. No new banners, assets, animation library or paid service were added.

### 8. Notification System
- Email notifications with templates
- In-app notification center
- Preference management
- Multi-channel delivery

### Job-board loading and recovery

The existing `/contractor/jobs` page reports service failures separately from empty or filtered results. Retry uses the existing `/api/jobs`; stale responses cannot replace a newer request or a signed-out state. Current `{ jobs, message }` and legacy array responses remain supported. Empty results do not claim unverified daily activity, and failures do not suggest buying more categories.

Focused validation: `.\node_modules\.bin\tsx.cmd --test scripts\contractor-job-board-loading.test.ts scripts\jobs-api-security.test.ts`.
Real signed-in browsing and acceptance still require an authorized isolated account/database. This package changes no access rules, subscriptions, billing, API routes or models.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Basic Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# Optional Integrations
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
```

See `.env.production.template` for complete production configuration.

### Database Setup

The project uses Prisma with SQLite for development:

```bash
# Generate Prisma client
npx prisma generate

# Apply database schema
npx prisma db push

# View database (optional)
npx prisma studio
```

For production, migrate to PostgreSQL:

```bash
# Update DATABASE_URL in .env
DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy
```

## 🚀 Deployment

### Quick Deploy to Vercel

1. **One-click deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/quotexbert)

2. **Manual deployment:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Complete Deployment Guide

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions including:
- Environment variable setup
- Database configuration
- Security settings
- Performance optimization
- Monitoring setup

## 📱 Demo & Testing

### Demo Accounts

The platform includes demo authentication for testing:

- **Homeowner Demo:** Test project posting and contractor hiring
- **Contractor Demo:** Test job browsing and quote submission

### Test Features

```bash
# Run tests
npm run test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

### API Testing

The platform includes comprehensive API endpoints:

- `/api/jobs` - Job management
- `/api/quotes` - Quote handling
- `/api/messages` - Messaging system
- `/api/payments` - Payment processing
- `/api/upload` - File management
- `/api/notifications` - Email system

## 🔒 Security

### Security Features

- Input validation and sanitization
- Rate limiting on API endpoints
- Secure file upload handling
- CSRF protection
- Security headers configuration
- Environment variable protection

### Security Best Practices

- Use HTTPS in production
- Implement proper authentication
- Validate all user inputs
- Use parameterized queries
- Keep dependencies updated
- Enable security headers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📚 API Documentation

### Core Endpoints

#### Jobs API
```typescript
GET    /api/jobs              # List jobs
POST   /api/jobs              # Create job
GET    /api/jobs/[id]         # Get job details
PUT    /api/jobs/[id]         # Update job
DELETE /api/jobs/[id]         # Delete job
```

#### Quotes API
```typescript
GET    /api/quotes            # List quotes
POST   /api/quotes            # Submit quote
PUT    /api/quotes/[id]       # Update quote
POST   /api/quotes/[id]/accept # Accept quote
```

#### Messages API
```typescript
GET    /api/conversations     # List conversations
POST   /api/conversations     # Create conversation
GET    /api/messages          # Get messages
POST   /api/messages          # Send message
```

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for complete API reference.

## 🎨 Customization

### Theming

The platform uses Tailwind CSS with custom design tokens:

```css
/* Custom colors in globals.css */
:root {
  --brand: #3b82f6;
  --brand-dark: #2563eb;
  --ink-900: #1f2937;
  --ink-100: #f3f4f6;
}
```

### Component Customization

All components are built with customization in mind:

```typescript
// Example: Custom button component
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg">
  Custom Button
</Button>
```

## 📊 Analytics & Monitoring

### Supported Analytics

- Google Analytics 4
- Microsoft Clarity
- Sentry error tracking
- Custom event tracking

### Performance Monitoring

- Core Web Vitals tracking
- API response time monitoring
- Error rate tracking
- User journey analytics

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Issues**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Environment Variables**
   - Ensure `.env.local` exists
   - Restart development server
   - Check variable names

### Getting Help

- Check [Issues](https://github.com/yourusername/quotexbert/issues)
- Review [Documentation](./docs/)
- Join our [Discord](https://discord.gg/quotexbert)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for the design system
- Prisma for database management
- Stripe for payment processing
- All contributors and testers

## 📞 Support

- **Documentation:** [docs/](./docs/)
- **API Reference:** [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/quotexbert/issues)
- **Email:** support@quotexbert.com

---

<div align="center">

**Built with ❤️ by the QuoteXbert team**

[Website](https://quotexbert.com) · [Twitter](https://twitter.com/quotexbert) · [LinkedIn](https://linkedin.com/company/quotexbert)

</div>

# Deployment test
