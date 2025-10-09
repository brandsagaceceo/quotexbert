# 🧪 QuoteXpert Testing Guide

## Quick Start - Demo Login
Visit: `http://localhost:3000/demo-login`

### 🏠 Test as Homeowner (homeowner@demo.com)
**Features to test:**
1. **Create Lead with Photos** (`/create-lead`)
   - Upload project photos (drag & drop)
   - Select project type (bathroom, kitchen, roofing, etc.)
   - Add voice/text description
   - Get AI-powered estimate
   - Submit lead to contractors

2. **Message Contractors** (`/homeowner/messages`)
   - Real-time chat with contractors
   - File sharing in messages
   - Notification system

3. **Review Contractors** (`/homeowner/jobs`)
   - Star rating system (1-5 stars)
   - Written reviews
   - Photo uploads for completed work

4. **Payment System** 
   - Stripe payment processing
   - Payment tracking
   - Invoice management

### 🔧 Test as Contractor (contractor@demo.com)
**Features to test:**
1. **Browse & Claim Leads** (`/contractor/jobs`)
   - View available leads with photos
   - Filter by project type, budget, location
   - Advanced search functionality
   - Claim leads and submit quotes

2. **Portfolio Management** (`/contractor/portfolio`)
   - Upload before/after photos
   - Create project galleries
   - Showcase completed work
   - Professional portfolio display

3. **Real-time Messaging** (`/contractor/messages`)
   - Chat with homeowners
   - Share files and photos
   - Professional communication

4. **Profile & Settings** (`/contractor/profile`)
   - Company information
   - Service areas
   - Pricing preferences
   - Notification settings

### 👑 Test as Admin (admin@demo.com)
**Features to test:**
1. **Analytics Dashboard** (`/admin/insights`)
   - Platform metrics
   - User activity
   - Lead conversion rates
   - Revenue tracking

2. **User Management**
   - View all users
   - Moderate content
   - Handle disputes

## 🧪 Testing Workflows

### Complete Lead Creation Flow
1. Login as homeowner
2. Go to "Create Lead"
3. Upload 2-3 project photos
4. Select project type
5. Add detailed description
6. Submit and review AI estimate
7. Confirm lead creation

### Complete Contractor Response Flow
1. Login as contractor
2. Browse available leads
3. View lead details and photos
4. Submit competitive quote
5. Message homeowner
6. Update portfolio with similar work

### Complete Review Flow
1. Complete a job (simulate in admin)
2. Login as homeowner
3. Rate contractor (5 stars)
4. Write detailed review
5. Upload completion photos
6. View on contractor profile

## 🔐 Security Features

### Current Security Measures
✅ **File Upload Security**
- File type validation (images only)
- File size limits (5MB max)
- Secure file storage
- XSS protection

✅ **Authentication Security**
- Role-based access control
- Session management
- Protected API routes

✅ **Database Security**
- Input validation
- SQL injection prevention
- Data encryption for sensitive fields

### For Production Launch

#### Environment Variables (.env.local)
```bash
# Database
DATABASE_URL="your-production-database-url"

# Authentication
CLERK_SECRET_KEY="your-clerk-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email
SMTP_HOST="your-smtp-host"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"

# Payments
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"

# File Storage
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
S3_BUCKET_NAME="your-s3-bucket"
```

#### Security Checklist for Launch
- [ ] **Database**: Migrate to PostgreSQL/MySQL
- [ ] **File Storage**: Move to AWS S3/Cloudinary
- [ ] **SSL Certificate**: Enable HTTPS
- [ ] **Rate Limiting**: Implement API rate limits
- [ ] **WAF**: Web Application Firewall
- [ ] **Monitoring**: Error tracking (Sentry)
- [ ] **Backups**: Automated database backups
- [ ] **Updates**: Regular dependency updates

#### Deployment Security
```bash
# 1. Build for production
npm run build

# 2. Set secure headers
# (Add to next.config.js)

# 3. Enable CSP
# Content Security Policy headers

# 4. Database migration
npx prisma db push --preview-feature

# 5. Environment validation
# Verify all env vars are set
```

## 🚀 Performance Testing

### Load Testing
- Test with 100+ concurrent users
- Monitor database performance
- Check API response times
- Verify file upload speeds

### Browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile responsiveness
- Touch interface testing
- Offline functionality

## 🐛 Common Issues & Fixes

### File Upload Issues
```bash
# Check permissions
chmod 755 public/uploads

# Verify file size limits
# Check client + server limits match
```

### Database Issues
```bash
# Reset database
npx prisma db push --force-reset
npx prisma db seed
```

### Authentication Issues
```bash
# Clear localStorage
localStorage.clear()

# Check Clerk configuration
# Verify environment variables
```

## 📊 Testing Metrics

Track these metrics during testing:
- **Performance**: Page load times < 2s
- **Reliability**: 99.9% uptime
- **Security**: 0 vulnerabilities
- **User Experience**: Task completion rates
- **Functionality**: All features working

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start

# Database operations
npx prisma studio      # Database GUI
npx prisma db seed     # Seed demo data
npx prisma generate    # Update client
```

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify network connectivity
3. Test with different browsers
4. Clear cache and cookies
5. Check demo user login status

**Demo Reset**: Simply refresh `/demo-login` to reset demo state.