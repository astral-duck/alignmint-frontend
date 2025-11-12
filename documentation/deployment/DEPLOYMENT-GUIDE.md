# IFM MVP - Deployment Guide

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Frontend Deployment](#frontend-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Database Setup](#database-setup)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Rollback Procedures](#rollback-procedures)

---

## Overview

This guide covers deploying the IFM MVP platform to production, including frontend (React), backend (Python/Django or Rails), and database (PostgreSQL).

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Production Stack                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │         │   Backend    │             │
│  │   (React)    │◄────────┤  (Django/    │             │
│  │   Netlify/   │  HTTPS  │   Rails)     │             │
│  │   Vercel     │         │   Heroku/    │             │
│  └──────────────┘         │   AWS        │             │
│                           └──────┬───────┘             │
│                                  │                      │
│                           ┌──────▼───────┐             │
│                           │  PostgreSQL  │             │
│                           │   Database   │             │
│                           │   (Managed)  │             │
│                           └──────────────┘             │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │    Redis     │         │   AWS S3     │             │
│  │   (Celery)   │         │  (Storage)   │             │
│  └──────────────┘         └──────────────┘             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Accounts
- [ ] **GitHub** - Source code repository
- [ ] **Netlify/Vercel** - Frontend hosting
- [ ] **Heroku/AWS/DigitalOcean** - Backend hosting
- [ ] **PostgreSQL** - Managed database (Heroku Postgres, AWS RDS, or DigitalOcean)
- [ ] **AWS S3** - File storage (or alternative)
- [ ] **SendGrid/Mailgun** - Email service
- [ ] **Stripe** - Payment processing
- [ ] **Sentry** - Error tracking (optional but recommended)

### Required Tools
- [ ] Git
- [ ] Node.js 18+
- [ ] Python 3.11+ (for Django) OR Ruby 3.2+ (for Rails)
- [ ] PostgreSQL client tools
- [ ] Heroku CLI (if using Heroku)
- [ ] AWS CLI (if using AWS)

---

## Environment Setup

### 1. Environment Variables

Create environment files for each environment:

#### Frontend (.env.production)
```bash
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_VERSION=v1

# Authentication
VITE_AUTH_TOKEN_KEY=ifm_auth_token
VITE_REFRESH_TOKEN_KEY=ifm_refresh_token

# Feature Flags
VITE_ENABLE_DONOR_PORTAL=true
VITE_ENABLE_VIDEOBOMB=true

# External Services
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_GOOGLE_MAPS_API_KEY=...

# Analytics (optional)
VITE_GA_TRACKING_ID=UA-...
```

#### Backend (Django .env)
```bash
# Django Settings
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com,yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/ifm_mvp_prod

# Redis (for Celery)
REDIS_URL=redis://host:6379/0

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT
JWT_ACCESS_TOKEN_LIFETIME=3600
JWT_REFRESH_TOKEN_LIFETIME=604800

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=ifm-mvp-prod
AWS_S3_REGION_NAME=us-west-2

# Sentry (Error Tracking)
SENTRY_DSN=https://...@sentry.io/...

# Tesseract (OCR)
TESSERACT_CMD=/usr/bin/tesseract
```

#### Backend (Rails .env)
```bash
# Rails Settings
SECRET_KEY_BASE=your-production-secret-key-here
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true

# Database
DATABASE_URL=postgresql://user:password@host:5432/ifm_mvp_prod

# Redis (for Sidekiq)
REDIS_URL=redis://host:6379/0

# CORS
FRONTEND_URL=https://yourdomain.com

# JWT
JWT_SECRET_KEY=your-jwt-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_ADDRESS=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_DOMAIN=yourdomain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET=ifm-mvp-prod
AWS_REGION=us-west-2

# Sentry
SENTRY_DSN=https://...@sentry.io/...
```

---

## Frontend Deployment

### Option 1: Netlify (Recommended)

#### Step 1: Connect Repository
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init
```

#### Step 2: Configure Build Settings

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### Step 3: Deploy
```bash
# Deploy to production
netlify deploy --prod

# Or configure continuous deployment from GitHub
# (Recommended - auto-deploys on push to main)
```

#### Step 4: Configure Environment Variables
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add all variables from `.env.production`
3. Redeploy

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Backend Deployment

### Option 1: Heroku (Django)

#### Step 1: Prepare Application

**Procfile:**
```
web: gunicorn config.wsgi --log-file -
worker: celery -A config worker -l info
beat: celery -A config beat -l info
```

**runtime.txt:**
```
python-3.11.6
```

**requirements.txt:**
```
# Add to your requirements
gunicorn==21.2.0
psycopg2-binary==2.9.9
dj-database-url==2.1.0
whitenoise==6.6.0
```

#### Step 2: Create Heroku App
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create ifm-mvp-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Add Redis
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=ifm-mvp-api.herokuapp.com
# ... (set all other env vars)
```

#### Step 3: Deploy
```bash
# Add Heroku remote
heroku git:remote -a ifm-mvp-api

# Push to Heroku
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# Collect static files
heroku run python manage.py collectstatic --noinput
```

#### Step 4: Scale Dynos
```bash
# Scale web dyno
heroku ps:scale web=1

# Scale worker dyno (for Celery)
heroku ps:scale worker=1

# Scale beat dyno (for scheduled tasks)
heroku ps:scale beat=1
```

### Option 2: AWS (Django)

#### Using AWS Elastic Beanstalk

**Step 1: Install EB CLI**
```bash
pip install awsebcli
```

**Step 2: Initialize**
```bash
eb init -p python-3.11 ifm-mvp-api --region us-west-2
```

**Step 3: Create Environment**
```bash
eb create ifm-mvp-prod
```

**Step 4: Configure**
```bash
# Set environment variables
eb setenv SECRET_KEY=your-secret-key DEBUG=False ...

# Deploy
eb deploy
```

### Option 3: DigitalOcean App Platform

**Step 1: Create app.yaml**
```yaml
name: ifm-mvp-api
services:
- name: web
  github:
    repo: your-org/ifm-backend
    branch: main
  build_command: pip install -r requirements.txt
  run_command: gunicorn config.wsgi
  environment_slug: python
  instance_count: 1
  instance_size_slug: professional-xs
  envs:
  - key: SECRET_KEY
    value: ${SECRET_KEY}
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

databases:
- name: db
  engine: PG
  version: "14"
```

**Step 2: Deploy**
```bash
# Using doctl CLI
doctl apps create --spec app.yaml
```

---

## Database Setup

### 1. Create Production Database

#### Heroku Postgres
```bash
# Already created with addon
heroku pg:info
```

#### AWS RDS
```bash
# Create via AWS Console or CLI
aws rds create-db-instance \
  --db-instance-identifier ifm-mvp-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20
```

### 2. Run Migrations

```bash
# Django
python manage.py migrate

# Rails
rails db:migrate
```

### 3. Load Initial Data

```bash
# Django
python manage.py loaddata initial_data.json

# Rails
rails db:seed
```

### 4. Create Admin User

```bash
# Django
python manage.py createsuperuser

# Rails
rails console
> User.create!(email: 'admin@example.com', password: 'secure-password', role: 'admin')
```

---

## Post-Deployment

### 1. Verify Deployment

#### Frontend Checks
- [ ] Site loads at production URL
- [ ] All pages render correctly
- [ ] API calls work
- [ ] Authentication works
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] Mobile responsive works

#### Backend Checks
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Authentication works
- [ ] Email sending works
- [ ] File uploads to S3 work
- [ ] Background jobs run
- [ ] Stripe webhooks work

### 2. Configure DNS

```bash
# Point your domain to deployment
# Netlify: Add custom domain in dashboard
# Heroku: heroku domains:add yourdomain.com
```

### 3. Configure SSL

```bash
# Netlify: Automatic with Let's Encrypt
# Heroku: heroku certs:auto:enable
```

### 4. Set Up Monitoring

#### Sentry (Error Tracking)
```bash
# Already configured via SENTRY_DSN env var
# Verify errors are being captured
```

#### Uptime Monitoring
- Set up UptimeRobot or Pingdom
- Monitor: https://yourdomain.com
- Monitor: https://api.yourdomain.com/health

#### Performance Monitoring
- Set up New Relic or DataDog (optional)

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check error logs (Sentry)
- [ ] Monitor uptime status
- [ ] Check background job queue

### Weekly Checks
- [ ] Review performance metrics
- [ ] Check database size/growth
- [ ] Review security alerts
- [ ] Check backup status

### Monthly Checks
- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Database optimization
- [ ] Cost review

### Backup Strategy

#### Database Backups
```bash
# Heroku (automatic daily backups)
heroku pg:backups:capture
heroku pg:backups:download

# Manual backup
pg_dump $DATABASE_URL > backup.sql
```

#### File Backups
- S3 versioning enabled
- Cross-region replication (optional)

---

## Rollback Procedures

### Frontend Rollback

#### Netlify
```bash
# Via Dashboard: Deploys → Previous Deploy → Publish
# Or via CLI:
netlify rollback
```

#### Vercel
```bash
# Via Dashboard: Deployments → Previous → Promote to Production
```

### Backend Rollback

#### Heroku
```bash
# List releases
heroku releases

# Rollback to previous release
heroku rollback

# Rollback to specific version
heroku rollback v123
```

#### Database Rollback
```bash
# Restore from backup
heroku pg:backups:restore b001 DATABASE_URL

# Or manual restore
psql $DATABASE_URL < backup.sql
```

---

## Troubleshooting

### Common Issues

#### Frontend Not Loading
1. Check build logs
2. Verify environment variables
3. Check API URL configuration
4. Clear CDN cache

#### API Errors
1. Check application logs
2. Verify database connection
3. Check environment variables
4. Verify migrations ran

#### Database Connection Issues
1. Check DATABASE_URL
2. Verify database is running
3. Check connection limits
4. Review firewall rules

#### Email Not Sending
1. Verify SMTP credentials
2. Check email service status
3. Review email logs
4. Test with simple email

---

## Security Checklist

- [ ] All environment variables set
- [ ] DEBUG=False in production
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protection (ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Secure headers configured
- [ ] Secrets rotated regularly
- [ ] Database backups automated
- [ ] Error tracking configured
- [ ] Logging enabled
- [ ] Monitoring alerts set up

---

## Performance Optimization

### Frontend
- [ ] Enable CDN
- [ ] Configure caching headers
- [ ] Compress assets
- [ ] Lazy load images
- [ ] Code splitting enabled

### Backend
- [ ] Database indexes created
- [ ] Query optimization
- [ ] Caching enabled (Redis)
- [ ] Connection pooling
- [ ] Background jobs for heavy tasks

---

## Support & Resources

- **Frontend Deployment:** See `ENVIRONMENT-SETUP.md`
- **Backend Deployment:** See backend-specific docs
- **Database:** See `../database/MIGRATION-STRATEGY.md`
- **Security:** See `../security/SECURITY-GUIDE.md`

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
