# QuoteXbert - Complete Home Improvement Platform

<div align="center">

![QuoteXbert Logo](public/logo.svg)

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

### Prerequisites

- Node.js 18+ 
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
- Demo authentication system
- Role-based access (homeowner/contractor)
- Profile management with image uploads
- Ready for Clerk integration

### 2. Job & Quote Management
- Job posting with AI estimate generation
- Quote submission and comparison
- Status tracking and updates
- File attachments support

### 3. Messaging System
- Real-time conversations
- File sharing capabilities
- Read receipts and notifications
- Mobile-optimized chat interface

### 4. Payment Processing
- Stripe integration for secure payments
- Milestone payment system
- Escrow-style fund holding
- Payment history and tracking

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

### 8. Notification System
- Email notifications with templates
- In-app notification center
- Preference management
- Multi-channel delivery

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
