# Python/Django Backend - API Implementation

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Framework:** Django REST Framework 3.14+  

---

## Table of Contents

1. [API Architecture](#api-architecture)
2. [ViewSets](#viewsets)
3. [Serializers](#serializers)
4. [Filters](#filters)
5. [Permissions](#permissions)
6. [Pagination](#pagination)
7. [URL Configuration](#url-configuration)

---

## API Architecture

### Django REST Framework (DRF)

DRF provides a powerful toolkit for building Web APIs:

- **ViewSets**: Combine logic for multiple related views
- **Serializers**: Convert between Python objects and JSON
- **Routers**: Automatically generate URL patterns
- **Permissions**: Fine-grained access control
- **Filters**: Query parameter filtering
- **Pagination**: Automatic pagination support

### Base URL Structure

```
/api/v1/auth/          # Authentication endpoints
/api/v1/donors/        # Donor CRUD
/api/v1/donations/     # Donation CRUD
/api/v1/accounting/    # Accounting endpoints
/api/v1/personnel/     # Personnel endpoints
/api/v1/marketing/     # Marketing endpoints
/api/v1/reports/       # Report generation
```

---

## ViewSets

### Donor ViewSet Example

```python
# apps/donors/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.core.permissions import IsOrganizationMember
from .models import Donor, DonorNote
from .serializers import DonorSerializer, DonorDetailSerializer, DonorNoteSerializer
from .filters import DonorFilter

class DonorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Donor CRUD operations
    
    Endpoints:
    - GET    /api/v1/donors/              List donors
    - POST   /api/v1/donors/              Create donor
    - GET    /api/v1/donors/{id}/         Get donor details
    - PUT    /api/v1/donors/{id}/         Update donor
    - PATCH  /api/v1/donors/{id}/         Partial update
    - DELETE /api/v1/donors/{id}/         Delete donor
    - POST   /api/v1/donors/{id}/add_note/    Add note
    - GET    /api/v1/donors/{id}/donations/   Get donations
    - POST   /api/v1/donors/{id}/send_email/  Send email
    - GET    /api/v1/donors/export/       Export donors
    """
    permission_classes = [IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = DonorFilter
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['last_name', 'total_donated', 'last_donation_date', 'created_at']
    ordering = ['-last_donation_date']
    
    def get_queryset(self):
        """Filter by user's organization"""
        return Donor.objects.filter(
            organization=self.request.user.organization
        ).select_related('organization').prefetch_related('donor_notes')
    
    def get_serializer_class(self):
        """Use detailed serializer for retrieve action"""
        if self.action == 'retrieve':
            return DonorDetailSerializer
        return DonorSerializer
    
    def perform_create(self, serializer):
        """Automatically set organization on create"""
        serializer.save(organization=self.request.user.organization)
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """
        Add note to donor
        POST /api/v1/donors/{id}/add_note/
        
        Body:
        {
            "note_type": "call",
            "content": "Discussed upcoming campaign"
        }
        """
        donor = self.get_object()
        serializer = DonorNoteSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                donor=donor,
                created_by=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def donations(self, request, pk=None):
        """
        Get donor's donation history
        GET /api/v1/donors/{id}/donations/
        """
        from apps.donations.serializers import DonationSerializer
        
        donor = self.get_object()
        donations = donor.donation_set.all().order_by('-donation_date')
        
        # Apply pagination
        page = self.paginate_queryset(donations)
        if page is not None:
            serializer = DonationSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        """
        Send email to donor
        POST /api/v1/donors/{id}/send_email/
        
        Body:
        {
            "subject": "Thank you!",
            "message": "Thank you for your support..."
        }
        """
        donor = self.get_object()
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        # Send email logic here
        from django.core.mail import send_mail
        send_mail(
            subject,
            message,
            'noreply@infocusministries.org',
            [donor.email],
            fail_silently=False,
        )
        
        return Response({'status': 'email sent'})
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """
        Export donors to CSV
        GET /api/v1/donors/export/
        """
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="donors.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['First Name', 'Last Name', 'Email', 'Phone', 'Total Donated'])
        
        donors = self.get_queryset()
        for donor in donors:
            writer.writerow([
                donor.first_name,
                donor.last_name,
                donor.email,
                donor.phone,
                donor.total_donated
            ])
        
        return response
```

### Donation ViewSet Example

```python
# apps/donations/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.permissions import IsOrganizationMember
from .models import Donation
from .serializers import DonationSerializer
from .services import DonationService

class DonationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Donation CRUD operations
    """
    permission_classes = [IsOrganizationMember]
    serializer_class = DonationSerializer
    
    def get_queryset(self):
        return Donation.objects.filter(
            organization=self.request.user.organization
        ).select_related('donor', 'organization')
    
    def perform_create(self, serializer):
        """Process donation through service layer"""
        donation = serializer.save(organization=self.request.user.organization)
        
        # Process payment and create journal entry
        DonationService.process_donation(donation)
    
    @action(detail=True, methods=['post'])
    def send_receipt(self, request, pk=None):
        """
        Send donation receipt
        POST /api/v1/donations/{id}/send_receipt/
        """
        donation = self.get_object()
        
        # Generate and send receipt
        from .services import ReceiptService
        ReceiptService.send_receipt(donation)
        
        donation.receipt_sent = True
        donation.save()
        
        return Response({'status': 'receipt sent'})
    
    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        """
        Refund a donation
        POST /api/v1/donations/{id}/refund/
        """
        donation = self.get_object()
        
        if donation.payment_status != 'completed':
            return Response(
                {'error': 'Can only refund completed donations'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process refund
        DonationService.refund_donation(donation)
        
        return Response({'status': 'refunded'})
```

---

## Serializers

### Basic Serializer

```python
# apps/donors/serializers.py
from rest_framework import serializers
from .models import Donor, DonorNote

class DonorSerializer(serializers.ModelSerializer):
    """Basic donor serializer for list views"""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Donor
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'donor_type', 'status', 'total_donated', 'donation_count',
            'last_donation_date', 'created_at'
        ]
        read_only_fields = ['id', 'total_donated', 'donation_count', 'created_at']
    
    def get_full_name(self, obj):
        return obj.full_name
    
    def validate_email(self, value):
        """Ensure email is unique within organization"""
        organization = self.context['request'].user.organization
        
        # Exclude current instance on update
        queryset = Donor.objects.filter(organization=organization, email=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Donor with this email already exists")
        
        return value
```

### Nested Serializer

```python
# apps/donors/serializers.py
class DonorDetailSerializer(DonorSerializer):
    """Detailed donor serializer with nested relationships"""
    
    recent_donations = serializers.SerializerMethodField()
    recent_notes = serializers.SerializerMethodField()
    
    class Meta(DonorSerializer.Meta):
        fields = DonorSerializer.Meta.fields + [
            'address_line1', 'address_line2', 'city', 'state', 'zip_code',
            'country', 'tags', 'notes', 'recent_donations', 'recent_notes'
        ]
    
    def get_recent_donations(self, obj):
        from apps.donations.serializers import DonationSerializer
        donations = obj.donation_set.order_by('-donation_date')[:5]
        return DonationSerializer(donations, many=True).data
    
    def get_recent_notes(self, obj):
        notes = obj.donor_notes.order_by('-created_at')[:5]
        return DonorNoteSerializer(notes, many=True).data


class DonorNoteSerializer(serializers.ModelSerializer):
    """Serializer for donor notes"""
    
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = DonorNote
        fields = ['id', 'note_type', 'content', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_by_name', 'created_at']
```

### Write-Only Fields

```python
# apps/donations/serializers.py
class DonationSerializer(serializers.ModelSerializer):
    """Donation serializer with payment processing"""
    
    donor_name = serializers.CharField(source='donor.full_name', read_only=True)
    
    # Write-only fields for payment processing
    stripe_token = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'donor_name', 'amount', 'donation_date',
            'payment_method', 'payment_status', 'stripe_token',
            'notes', 'created_at'
        ]
        read_only_fields = ['id', 'payment_status', 'created_at']
    
    def validate(self, data):
        """Validate payment method requirements"""
        payment_method = data.get('payment_method')
        
        if payment_method == 'credit_card' and not data.get('stripe_token'):
            raise serializers.ValidationError({
                'stripe_token': 'Stripe token required for credit card payments'
            })
        
        return data
```

---

## Filters

### Custom Filter Class

```python
# apps/donors/filters.py
from django_filters import rest_framework as filters
from .models import Donor

class DonorFilter(filters.FilterSet):
    """Custom filters for donor queryset"""
    
    # Exact match filters
    status = filters.ChoiceFilter(choices=Donor._meta.get_field('status').choices)
    donor_type = filters.ChoiceFilter(choices=Donor._meta.get_field('donor_type').choices)
    
    # Range filters
    total_donated_min = filters.NumberFilter(field_name='total_donated', lookup_expr='gte')
    total_donated_max = filters.NumberFilter(field_name='total_donated', lookup_expr='lte')
    
    # Date filters
    last_donation_after = filters.DateFilter(field_name='last_donation_date', lookup_expr='gte')
    last_donation_before = filters.DateFilter(field_name='last_donation_date', lookup_expr='lte')
    
    # Tag filter (JSON field)
    has_tag = filters.CharFilter(method='filter_by_tag')
    
    class Meta:
        model = Donor
        fields = ['status', 'donor_type']
    
    def filter_by_tag(self, queryset, name, value):
        """Filter donors by tag"""
        return queryset.filter(tags__contains=[value])


# Usage in URL:
# /api/v1/donors/?status=active&total_donated_min=1000&has_tag=major-donor
```

---

## Permissions

### Custom Permission Classes

```python
# apps/core/permissions.py
from rest_framework import permissions

class IsOrganizationMember(permissions.BasePermission):
    """
    Permission to check if user belongs to the organization
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Check if object belongs to user's organization
        if hasattr(obj, 'organization'):
            return obj.organization == request.user.organization
        return False


class IsFiscalSponsor(permissions.BasePermission):
    """
    Permission for fiscal sponsor (super admin) only
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and
            request.user.role == 'fiscal_sponsor'
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners to edit
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to owner
        return obj.created_by == request.user


class CanApproveExpenses(permissions.BasePermission):
    """
    Permission for users who can approve expenses
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and
            request.user.role in ['admin', 'manager']
        )
```

### Using Multiple Permissions

```python
# apps/accounting/views.py
from rest_framework import viewsets
from apps.core.permissions import IsOrganizationMember, CanApproveExpenses

class ExpenseViewSet(viewsets.ModelViewSet):
    """Expense management with approval workflow"""
    
    def get_permissions(self):
        """Different permissions for different actions"""
        if self.action == 'approve':
            return [IsOrganizationMember(), CanApproveExpenses()]
        return [IsOrganizationMember()]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve expense (managers only)"""
        expense = self.get_object()
        expense.status = 'approved'
        expense.approved_by = request.user
        expense.save()
        return Response({'status': 'approved'})
```

---

## Pagination

### Custom Pagination Class

```python
# apps/core/pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination with customizable page size"""
    
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page_size': self.page_size,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })


# Usage in ViewSet:
class DonorViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
```

---

## URL Configuration

### App URLs

```python
# apps/donors/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DonorViewSet

router = DefaultRouter()
router.register(r'', DonorViewSet, basename='donor')

urlpatterns = [
    path('', include(router.urls)),
]

# This generates:
# GET    /api/v1/donors/
# POST   /api/v1/donors/
# GET    /api/v1/donors/{id}/
# PUT    /api/v1/donors/{id}/
# PATCH  /api/v1/donors/{id}/
# DELETE /api/v1/donors/{id}/
# POST   /api/v1/donors/{id}/add_note/
# GET    /api/v1/donors/{id}/donations/
# etc.
```

### Root URLs

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # API v1
    path('api/v1/auth/', include('apps.core.urls.auth')),
    path('api/v1/organizations/', include('apps.core.urls.organizations')),
    path('api/v1/users/', include('apps.core.urls.users')),
    path('api/v1/donors/', include('apps.donors.urls')),
    path('api/v1/donations/', include('apps.donations.urls')),
    path('api/v1/accounting/', include('apps.accounting.urls')),
    path('api/v1/personnel/', include('apps.personnel.urls')),
    path('api/v1/marketing/', include('apps.marketing.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
]
```

### Authentication URLs

```python
# apps/core/urls/auth.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from ..views import RegisterView, LogoutView, UserProfileView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
]
```

---

## Testing ViewSets

```python
# apps/donors/tests/test_views.py
import pytest
from rest_framework.test import APIClient
from apps.core.models import User, Organization
from apps.donors.models import Donor

@pytest.mark.django_db
class TestDonorViewSet:
    """Test donor API endpoints"""
    
    def setup_method(self):
        """Setup test data"""
        self.client = APIClient()
        self.org = Organization.objects.create(name='Test Org', slug='test-org')
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.user.organization = self.org
        self.client.force_authenticate(user=self.user)
    
    def test_list_donors(self):
        """Test listing donors"""
        Donor.objects.create(
            organization=self.org,
            first_name='John',
            last_name='Doe',
            email='john@example.com'
        )
        
        response = self.client.get('/api/v1/donors/')
        
        assert response.status_code == 200
        assert len(response.data['results']) == 1
    
    def test_create_donor(self):
        """Test creating a donor"""
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com',
            'donor_type': 'individual'
        }
        
        response = self.client.post('/api/v1/donors/', data)
        
        assert response.status_code == 201
        assert Donor.objects.filter(email='jane@example.com').exists()
```

---

## Related Documentation

- **Overview**: `PYTHON-BACKEND-OVERVIEW.md` - Setup and configuration
- **Models**: `PYTHON-MODELS.md` - Database models
- **Business Logic**: `PYTHON-BUSINESS-LOGIC.md` - Services layer
- **API Requirements**: `02-API-REQUIREMENTS.md` - Complete endpoint list

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
