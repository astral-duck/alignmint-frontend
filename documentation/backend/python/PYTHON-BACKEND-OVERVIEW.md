# Python/Django Backend - Overview & Setup

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Framework:** Django 5.0+ with Django REST Framework  
**Database:** PostgreSQL 14+

---

## Table of Contents

1. [Why Django?](#why-django)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Configuration](#configuration)
6. [Development Workflow](#development-workflow)

---

## Why Django?

### Django vs Rails Comparison

| Feature | Django | Rails | Winner |
|---------|--------|-------|--------|
| **Admin Interface** | Built-in, excellent | Needs gem (ActiveAdmin) | Django ✅ |
| **REST Framework** | DRF (best-in-class) | Good | Django ✅ |
| **ORM** | Powerful, intuitive | ActiveRecord (excellent) | Tie |
| **Type Safety** | Python 3.10+ type hints | Sorbet/RBS | Django ✅ |
| **Async Support** | Native (Django 3.1+) | Good | Tie |
| **Community** | Huge | Huge | Tie |
| **Learning Curve** | Moderate | Moderate | Tie |
| **Performance** | Good | Good | Tie |
| **Ecosystem** | Excellent | Excellent | Tie |

### Key Advantages for IFM MVP

1. **Built-in Admin** - Immediate admin interface for data management
2. **Django REST Framework** - Industry-leading REST API framework
3. **Type Safety** - Python type hints for better code quality
4. **PostgreSQL Integration** - Excellent PostgreSQL support with advanced features
5. **Security** - Built-in protection against common vulnerabilities
6. **Scalability** - Proven at scale (Instagram, Pinterest, Spotify)

---

## Technology Stack

### Core Framework

```python
# requirements/base.txt
Django==5.0.1
djangorestframework==3.14.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.3.1
psycopg2-binary==2.9.9
python-decouple==3.8
```

### Additional Packages

```python
# requirements/base.txt (continued)

# Data & Validation
pydantic==2.5.3
django-filter==23.5
django-phonenumber-field==7.3.0

# File Processing & OCR
Pillow==10.1.0
python-magic==0.4.27
pytesseract==0.3.10  # OCR for check deposits
pdf2image==1.16.3

# Payment Processing
stripe==7.8.0

# Email
django-ses==3.5.2
# OR sendgrid==6.11.0

# Background Jobs
celery==5.3.4
redis==5.0.1
django-celery-beat==2.5.0

# Monitoring & Logging
sentry-sdk==1.39.2
django-debug-toolbar==4.2.0

# Testing
pytest==7.4.3
pytest-django==4.7.0
pytest-cov==4.1.0
factory-boy==3.3.0
faker==21.0.0
```

### Development Tools

```python
# requirements/dev.txt
-r base.txt

# Code Quality
black==23.12.1
flake8==7.0.0
isort==5.13.2
mypy==1.7.1
pylint==3.0.3

# Documentation
django-extensions==3.2.3
drf-spectacular==0.27.0  # OpenAPI/Swagger
```

---

## Project Structure

```
ifm_backend/
├── manage.py
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   ├── production.txt
│   └── test.txt
├── .env.example
├── .gitignore
├── pytest.ini
├── docker-compose.yml
├── Dockerfile
│
├── config/                      # Project settings
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py             # Base settings
│   │   ├── development.py      # Dev overrides
│   │   ├── production.py       # Prod settings
│   │   └── test.py             # Test settings
│   ├── urls.py                 # Root URL config
│   ├── wsgi.py                 # WSGI entry point
│   └── asgi.py                 # ASGI entry point
│
├── apps/                        # Django apps
│   ├── __init__.py
│   │
│   ├── core/                    # Core models & utilities
│   │   ├── __init__.py
│   │   ├── models.py           # Organization, User, OrganizationUser
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── permissions.py      # RBAC logic
│   │   ├── middleware.py       # Multi-tenant middleware
│   │   ├── admin.py
│   │   ├── urls/
│   │   │   ├── auth.py
│   │   │   ├── organizations.py
│   │   │   └── users.py
│   │   └── tests/
│   │
│   ├── donors/                  # Donor management
│   │   ├── models.py           # Donor, DonorAddress, DonorNote, DonorTag
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── filters.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── donations/               # Donation processing
│   │   ├── models.py           # Donation, RecurringDonation, DonationAllocation
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py         # Payment processing logic
│   │   ├── tasks.py            # Celery tasks
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── accounting/              # Financial management
│   │   ├── models.py           # Account, JournalEntry, LedgerEntry, etc.
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── journal_entry.py
│   │   │   ├── ledger.py
│   │   │   └── reconciliation.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── personnel/               # Staff & volunteers
│   │   ├── models.py           # Personnel, Volunteer, HourEntry
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   ├── marketing/               # Campaigns & prospects
│   │   ├── models.py           # Campaign, DonorPage, Prospect
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   │
│   └── reports/                 # Financial reports
│       ├── views.py
│       ├── serializers.py
│       ├── services/
│       │   ├── __init__.py
│       │   ├── balance_sheet.py
│       │   ├── income_statement.py
│       │   └── fund_accounting.py
│       ├── urls.py
│       └── tests/
│
├── tests/                       # Integration tests
│   ├── __init__.py
│   ├── conftest.py
│   ├── factories/
│   │   ├── __init__.py
│   │   ├── core.py
│   │   ├── donors.py
│   │   └── accounting.py
│   └── integration/
│       ├── test_donation_flow.py
│       └── test_accounting_flow.py
│
├── scripts/                     # Management scripts
│   ├── seed_data.py
│   ├── import_legacy.py
│   └── generate_test_data.py
│
├── static/                      # Static files
├── media/                       # User uploads
└── logs/                        # Application logs
```

---

## Environment Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis 7+ (for Celery)
- Tesseract OCR (for check processing)

### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd ifm_backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements/dev.txt

# 4. Copy environment file
cp .env.example .env
# Edit .env with your settings

# 5. Create database
createdb ifm_mvp_dev

# 6. Run migrations
python manage.py migrate

# 7. Create superuser
python manage.py createsuperuser

# 8. Load seed data (optional)
python manage.py loaddata scripts/seed_data.json

# 9. Run development server
python manage.py runserver
```

### Docker Setup (Alternative)

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# View logs
docker-compose logs -f web
```

---

## Configuration

### Environment Variables

```bash
# .env.example

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ifm_mvp_dev

# Redis (for Celery)
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT
JWT_ACCESS_TOKEN_LIFETIME=3600  # 1 hour in seconds
JWT_REFRESH_TOKEN_LIFETIME=604800  # 7 days

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=ifm-mvp-uploads
AWS_S3_REGION_NAME=us-west-2

# Sentry (error tracking)
SENTRY_DSN=https://...@sentry.io/...

# Tesseract (OCR)
TESSERACT_CMD=/usr/bin/tesseract
```

### Settings Structure

```python
# config/settings/base.py
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    
    # Local apps
    'apps.core',
    'apps.donors',
    'apps.donations',
    'apps.accounting',
    'apps.personnel',
    'apps.marketing',
    'apps.reports',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.core.middleware.OrganizationMiddleware',  # Custom
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='ifm_mvp_dev'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Custom User Model
AUTH_USER_MODEL = 'core.User'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CORS_ALLOW_CREDENTIALS = True

# Celery
CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('REDIS_URL', default='redis://localhost:6379/0')
```

---

## Development Workflow

### Running the Development Server

```bash
# Activate virtual environment
source venv/bin/activate

# Run Django development server
python manage.py runserver

# Run Celery worker (separate terminal)
celery -A config worker -l info

# Run Celery beat (scheduled tasks, separate terminal)
celery -A config beat -l info
```

### Database Management

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create migration for specific app
python manage.py makemigrations donors

# Show migration SQL
python manage.py sqlmigrate donors 0001

# Rollback migration
python manage.py migrate donors 0001
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps --cov-report=html

# Run specific test file
pytest apps/donors/tests/test_views.py

# Run specific test
pytest apps/donors/tests/test_views.py::TestDonorViewSet::test_create_donor

# Run with verbose output
pytest -v
```

### Code Quality

```bash
# Format code with Black
black .

# Sort imports
isort .

# Lint with flake8
flake8 apps/

# Type checking with mypy
mypy apps/

# Run all checks
black . && isort . && flake8 apps/ && mypy apps/
```

### Django Shell

```bash
# Open Django shell
python manage.py shell

# Or use shell_plus (django-extensions)
python manage.py shell_plus

# Example usage:
>>> from apps.donors.models import Donor
>>> donors = Donor.objects.all()
>>> donor = Donor.objects.first()
>>> donor.full_name
```

### Admin Interface

Access the Django admin at: `http://localhost:8000/admin/`

The admin provides immediate CRUD interface for all models.

---

## API Documentation

### Swagger/OpenAPI

Django REST Framework Spectacular provides automatic API documentation:

```python
# config/urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # ...
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

Access at: `http://localhost:8000/api/docs/`

---

## Next Steps

1. **Review Models**: See `PYTHON-MODELS.md` for complete Django model definitions
2. **Review API**: See `PYTHON-API.md` for ViewSets and Serializers
3. **Review Business Logic**: See `PYTHON-BUSINESS-LOGIC.md` for services layer
4. **Review Deployment**: See `PYTHON-DEPLOYMENT.md` for production setup

---

## Related Documentation

- **Frontend**: `../README.md` - Frontend application
- **Data Schema**: `01-DATA-SCHEMA.md` - Database schema (framework-agnostic)
- **API Requirements**: `02-API-REQUIREMENTS.md` - API endpoints (framework-agnostic)
- **Rails Alternative**: `TECHNICAL-SPEC.md` - Rails implementation guide

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
