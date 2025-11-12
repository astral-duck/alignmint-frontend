# Python/Django Backend - Database Models

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Framework:** Django 5.0+ ORM  
**Database:** PostgreSQL 14+

---

## Table of Contents

1. [Core Models](#core-models)
2. [Donor Models](#donor-models)
3. [Donation Models](#donation-models)
4. [Accounting Models](#accounting-models)
5. [Personnel Models](#personnel-models)
6. [Marketing Models](#marketing-models)
7. [Model Signals](#model-signals)
8. [Model Managers](#model-managers)

---

## Core Models

### Organization

```python
# apps/core/models.py
from django.db import models
import uuid

class Organization(models.Model):
    """Nonprofit entity managed by fiscal sponsor"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=100)
    type = models.CharField(
        max_length=50,
        choices=[
            ('nonprofit', 'Nonprofit'),
            ('all', 'All Organizations')
        ],
        default='nonprofit'
    )
    status = models.CharField(
        max_length=50,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('pending', 'Pending')
        ],
        default='active'
    )
    
    # Contact information
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    
    # Address
    address_line1 = models.CharField(max_length=255, null=True, blank=True)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    
    # Tax information
    ein = models.CharField(max_length=20, null=True, blank=True, verbose_name='EIN')
    
    # Settings
    settings = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organizations'
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.name
```

### User

```python
# apps/core/models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
import uuid

class UserManager(BaseUserManager):
    """Custom user manager"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """System user with custom authentication"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    
    role = models.CharField(
        max_length=50,
        choices=[
            ('fiscal_sponsor', 'Fiscal Sponsor'),
            ('admin', 'Administrator'),
            ('manager', 'Manager'),
            ('staff', 'Staff'),
            ('volunteer', 'Volunteer'),
            ('donor', 'Donor'),
        ],
        default='staff'
    )
    
    avatar_url = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    
    status = models.CharField(
        max_length=50,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('pending', 'Pending'),
        ],
        default='active'
    )
    
    last_sign_in_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Django required fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['last_name', 'first_name']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['role']),
        ]
    
    def __str__(self):
        return self.full_name
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def organization(self):
        """Get user's primary organization"""
        org_user = self.organizationuser_set.first()
        return org_user.organization if org_user else None


class OrganizationUser(models.Model):
    """Many-to-many relationship between users and organizations"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    role = models.CharField(
        max_length=50,
        choices=[
            ('admin', 'Administrator'),
            ('manager', 'Manager'),
            ('staff', 'Staff'),
            ('viewer', 'Viewer'),
        ],
        default='staff'
    )
    
    permissions = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organization_users'
        unique_together = [['organization', 'user']]
        indexes = [
            models.Index(fields=['organization']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"{self.user.full_name} - {self.organization.name}"
```

---

## Donor Models

```python
# apps/donors/models.py
from django.db import models
from apps.core.models import Organization
from decimal import Decimal
import uuid

class Donor(models.Model):
    """Donor profile and contact information"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    
    # Personal information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, null=True, blank=True)
    
    # Address
    address_line1 = models.CharField(max_length=255, null=True, blank=True)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=2, default='US')
    
    # Donor classification
    donor_type = models.CharField(
        max_length=50,
        choices=[
            ('individual', 'Individual'),
            ('organization', 'Organization'),
            ('foundation', 'Foundation'),
        ],
        default='individual'
    )
    
    status = models.CharField(
        max_length=50,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('lapsed', 'Lapsed'),
        ],
        default='active'
    )
    
    # Aggregated donation data (updated via signals)
    total_donated = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00')
    )
    first_donation_date = models.DateField(null=True, blank=True)
    last_donation_date = models.DateField(null=True, blank=True)
    donation_count = models.IntegerField(default=0)
    
    # Tags and notes
    tags = models.JSONField(default=list, blank=True)
    notes = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donors'
        ordering = ['last_name', 'first_name']
        indexes = [
            models.Index(fields=['organization', 'email']),
            models.Index(fields=['organization', 'last_name']),
            models.Index(fields=['status']),
            models.Index(fields=['last_donation_date']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class DonorAddress(models.Model):
    """Additional addresses for donors"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(Donor, related_name='addresses', on_delete=models.CASCADE)
    
    address_type = models.CharField(
        max_length=50,
        choices=[
            ('home', 'Home'),
            ('work', 'Work'),
            ('billing', 'Billing'),
            ('shipping', 'Shipping'),
        ]
    )
    
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=2, default='US')
    
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donor_addresses'
        verbose_name_plural = 'Donor addresses'


class DonorNote(models.Model):
    """Notes and interactions with donors"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(Donor, related_name='donor_notes', on_delete=models.CASCADE)
    created_by = models.ForeignKey('core.User', on_delete=models.PROTECT)
    
    note_type = models.CharField(
        max_length=50,
        choices=[
            ('call', 'Phone Call'),
            ('email', 'Email'),
            ('meeting', 'Meeting'),
            ('general', 'General Note'),
        ],
        default='general'
    )
    
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donor_notes'
        ordering = ['-created_at']


class DonorTag(models.Model):
    """Tags for donor segmentation"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donor_tags'
        unique_together = [['organization', 'name']]
```

---

## Donation Models

```python
# apps/donations/models.py
from django.db import models
from apps.core.models import Organization
from apps.donors.models import Donor
from decimal import Decimal
import uuid

class Donation(models.Model):
    """Donation transaction record"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    donor = models.ForeignKey(Donor, on_delete=models.PROTECT)
    
    # Amount and currency
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Donation details
    donation_date = models.DateField()
    donation_type = models.CharField(
        max_length=50,
        choices=[
            ('one-time', 'One-Time'),
            ('recurring', 'Recurring'),
            ('pledge', 'Pledge'),
        ],
        default='one-time'
    )
    
    # Payment information
    payment_method = models.CharField(
        max_length=50,
        choices=[
            ('credit_card', 'Credit Card'),
            ('check', 'Check'),
            ('cash', 'Cash'),
            ('ach', 'ACH/Bank Transfer'),
            ('wire', 'Wire Transfer'),
            ('stock', 'Stock/Securities'),
        ]
    )
    
    payment_status = models.CharField(
        max_length=50,
        choices=[
            ('completed', 'Completed'),
            ('pending', 'Pending'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )
    
    # External references
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    check_number = models.CharField(max_length=50, null=True, blank=True)
    
    # Accounting integration
    journal_entry = models.ForeignKey(
        'accounting.JournalEntry',
        null=True,
        blank=True,
        on_delete=models.PROTECT
    )
    
    # Metadata
    notes = models.TextField(null=True, blank=True)
    receipt_sent = models.BooleanField(default=False)
    receipt_sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donations'
        ordering = ['-donation_date']
        indexes = [
            models.Index(fields=['organization', 'donation_date']),
            models.Index(fields=['donor']),
            models.Index(fields=['payment_status']),
        ]
    
    def __str__(self):
        return f"{self.donor.full_name} - ${self.amount} on {self.donation_date}"


class RecurringDonation(models.Model):
    """Recurring donation subscription"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    donor = models.ForeignKey(Donor, on_delete=models.PROTECT)
    
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    frequency = models.CharField(
        max_length=50,
        choices=[
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('quarterly', 'Quarterly'),
            ('annually', 'Annually'),
        ]
    )
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_donation_date = models.DateField()
    
    status = models.CharField(
        max_length=50,
        choices=[
            ('active', 'Active'),
            ('paused', 'Paused'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed'),
        ],
        default='active'
    )
    
    # Payment method
    payment_method = models.CharField(max_length=50)
    stripe_subscription_id = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recurring_donations'


class DonationAllocation(models.Model):
    """Fund allocation for donations"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donation = models.ForeignKey(Donation, related_name='allocations', on_delete=models.CASCADE)
    fund = models.ForeignKey('accounting.Fund', on_delete=models.PROTECT)
    
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donation_allocations'
```

---

## Accounting Models

See full accounting models in the next section. Here's a preview:

```python
# apps/accounting/models.py

class Account(models.Model):
    """Chart of Accounts"""
    # See PYTHON-BUSINESS-LOGIC.md for full implementation

class JournalEntry(models.Model):
    """Journal Entry header"""
    # See PYTHON-BUSINESS-LOGIC.md for full implementation

class JournalEntryLine(models.Model):
    """Journal Entry line items"""
    # See PYTHON-BUSINESS-LOGIC.md for full implementation

class LedgerEntry(models.Model):
    """General Ledger entries"""
    # See PYTHON-BUSINESS-LOGIC.md for full implementation

class Expense(models.Model):
    """Expense tracking"""
    # Full model definition...

class Reimbursement(models.Model):
    """Employee reimbursements"""
    # Full model definition...

class CheckDeposit(models.Model):
    """Check deposits with OCR"""
    # Full model definition...

class Reconciliation(models.Model):
    """Bank reconciliation"""
    # Full model definition...

class Fund(models.Model):
    """Fund accounting"""
    # Full model definition...
```

---

## Model Signals

Django signals for automatic updates:

```python
# apps/donors/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Donor
from apps.donations.models import Donation

@receiver(post_save, sender=Donation)
def update_donor_stats_on_donation(sender, instance, created, **kwargs):
    """Update donor aggregated fields when donation is created/updated"""
    if instance.payment_status == 'completed':
        donor = instance.donor
        donations = Donation.objects.filter(
            donor=donor,
            payment_status='completed'
        )
        
        donor.total_donated = sum(d.amount for d in donations)
        donor.donation_count = donations.count()
        donor.last_donation_date = donations.order_by('-donation_date').first().donation_date
        
        if not donor.first_donation_date:
            donor.first_donation_date = donations.order_by('donation_date').first().donation_date
        
        donor.save()


@receiver(post_delete, sender=Donation)
def update_donor_stats_on_deletion(sender, instance, **kwargs):
    """Update donor stats when donation is deleted"""
    donor = instance.donor
    donations = Donation.objects.filter(
        donor=donor,
        payment_status='completed'
    )
    
    if donations.exists():
        donor.total_donated = sum(d.amount for d in donations)
        donor.donation_count = donations.count()
        donor.last_donation_date = donations.order_by('-donation_date').first().donation_date
    else:
        donor.total_donated = 0
        donor.donation_count = 0
        donor.last_donation_date = None
    
    donor.save()
```

---

## Model Managers

Custom managers for common queries:

```python
# apps/donors/managers.py
from django.db import models

class DonorManager(models.Manager):
    """Custom manager for Donor model"""
    
    def active(self):
        """Get active donors only"""
        return self.filter(status='active')
    
    def with_recent_donations(self, days=30):
        """Get donors with donations in last N days"""
        from django.utils import timezone
        from datetime import timedelta
        cutoff = timezone.now().date() - timedelta(days=days)
        return self.filter(last_donation_date__gte=cutoff)
    
    def major_donors(self, threshold=1000):
        """Get donors who have donated more than threshold"""
        return self.filter(total_donated__gte=threshold)


# Usage in model:
class Donor(models.Model):
    # ... fields ...
    
    objects = DonorManager()
    
    # Now you can use:
    # Donor.objects.active()
    # Donor.objects.major_donors(5000)
```

---

## Related Documentation

- **Overview**: `PYTHON-BACKEND-OVERVIEW.md` - Setup and configuration
- **API**: `PYTHON-API.md` - ViewSets and Serializers
- **Business Logic**: `PYTHON-BUSINESS-LOGIC.md` - Services and complex logic
- **Data Schema**: `01-DATA-SCHEMA.md` - Framework-agnostic schema

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
