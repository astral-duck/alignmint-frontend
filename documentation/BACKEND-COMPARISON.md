# Backend Framework Comparison - Rails vs Django

**Version:** 1.0  
**Last Updated:** November 12, 2025  

---

## Quick Comparison

| Aspect | Ruby on Rails | Python/Django | Recommendation |
|--------|---------------|---------------|----------------|
| **Learning Curve** | Moderate | Moderate | Tie |
| **Admin Interface** | Needs ActiveAdmin gem | Built-in (excellent) | **Django** ✅ |
| **REST API** | Good (native) | Excellent (DRF) | **Django** ✅ |
| **ORM** | ActiveRecord | Django ORM | Tie |
| **Type Safety** | Sorbet/RBS | Native type hints | **Django** ✅ |
| **Community** | Large | Large | Tie |
| **Performance** | Good | Good | Tie |
| **Deployment** | Easy | Easy | Tie |
| **Testing** | RSpec (excellent) | pytest (excellent) | Tie |
| **Background Jobs** | Sidekiq | Celery | Tie |
| **Ecosystem** | Mature | Mature | Tie |

---

## Documentation Mapping

### Rails Documentation
- `TECHNICAL-SPEC.md` - Rails implementation guide
- `01-DATA-SCHEMA.md` - Database schema (framework-agnostic)
- `02-API-REQUIREMENTS.md` - API endpoints (framework-agnostic)

### Django Documentation
- `PYTHON-BACKEND-OVERVIEW.md` - Setup and configuration
- `PYTHON-MODELS.md` - Django ORM models
- `PYTHON-API.md` - Django REST Framework implementation
- `PYTHON-BUSINESS-LOGIC.md` - Services and business logic

### Shared Documentation
- `01-DATA-SCHEMA.md` - Database schema (works for both)
- `02-API-REQUIREMENTS.md` - API endpoints (works for both)
- `03-COMPONENT-INTEGRATIONS.md` - Integration flows
- `04-USER-ROLES-AND-PERMISSIONS.md` - RBAC system

---

## Code Comparison

### Model Definition

**Rails (ActiveRecord):**
```ruby
# app/models/donor.rb
class Donor < ApplicationRecord
  belongs_to :organization
  has_many :donations
  
  validates :email, presence: true, uniqueness: { scope: :organization_id }
  
  def full_name
    "#{first_name} #{last_name}"
  end
end
```

**Django (ORM):**
```python
# apps/donors/models.py
class Donor(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    email = models.EmailField()
    
    class Meta:
        unique_together = [['organization', 'email']]
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
```

### API Endpoint

**Rails (Controller):**
```ruby
# app/controllers/api/v1/donors_controller.rb
class Api::V1::DonorsController < ApplicationController
  def index
    @donors = current_user.organization.donors
    render json: @donors
  end
  
  def create
    @donor = current_user.organization.donors.build(donor_params)
    if @donor.save
      render json: @donor, status: :created
    else
      render json: @donor.errors, status: :unprocessable_entity
    end
  end
end
```

**Django (ViewSet):**
```python
# apps/donors/views.py
class DonorViewSet(viewsets.ModelViewSet):
    serializer_class = DonorSerializer
    
    def get_queryset(self):
        return Donor.objects.filter(
            organization=self.request.user.organization
        )
    
    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)
```

### Business Logic

**Rails (Service Object):**
```ruby
# app/services/donation_service.rb
class DonationService
  def self.process_donation(donation)
    ActiveRecord::Base.transaction do
      process_payment(donation)
      create_journal_entry(donation)
      send_receipt(donation)
    end
  end
end
```

**Django (Service):**
```python
# apps/donations/services.py
class DonationService:
    @staticmethod
    @transaction.atomic
    def process_donation(donation):
        DonationService._process_payment(donation)
        DonationService._create_journal_entry(donation)
        ReceiptService.send_receipt(donation)
```

---

## Pros and Cons

### Ruby on Rails

**Pros:**
- Convention over configuration
- Mature ecosystem
- Excellent for rapid development
- Strong community
- Great gems available

**Cons:**
- No built-in admin interface
- Type safety requires additional tools
- Slightly slower than Django for some operations

### Python/Django

**Pros:**
- Built-in admin interface (huge time saver)
- Django REST Framework (best-in-class)
- Native type hints (Python 3.10+)
- Excellent ORM
- Great for data-heavy applications

**Cons:**
- More explicit than Rails (less "magic")
- Settings can be verbose

---

## Recommendation for IFM MVP

### Choose Django if:
- ✅ You want a built-in admin interface
- ✅ You prefer type safety
- ✅ Your team knows Python
- ✅ You want the best REST API framework (DRF)

### Choose Rails if:
- ✅ Your team knows Ruby
- ✅ You prefer convention over configuration
- ✅ You want faster initial development
- ✅ You're comfortable adding gems for features

---

## Migration Path

Both frameworks can use the same:
- PostgreSQL database
- Frontend React application
- API contract (endpoints)
- Authentication strategy (JWT)
- Deployment infrastructure

**You can switch between them** with minimal frontend changes since the API contract is the same.

---

## File Structure Comparison

### Rails
```
app/
├── models/
├── controllers/
├── services/
├── serializers/
└── views/
```

### Django
```
apps/
├── donors/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── services.py
```

---

## Testing Comparison

### Rails (RSpec)
```ruby
RSpec.describe Donor, type: :model do
  it 'validates email uniqueness within organization' do
    donor = create(:donor)
    duplicate = build(:donor, email: donor.email, organization: donor.organization)
    expect(duplicate).not_to be_valid
  end
end
```

### Django (pytest)
```python
@pytest.mark.django_db
def test_email_uniqueness_within_organization():
    donor = DonorFactory()
    duplicate = Donor(
        email=donor.email,
        organization=donor.organization
    )
    with pytest.raises(ValidationError):
        duplicate.full_clean()
```

---

## Deployment Comparison

Both frameworks deploy similarly:

### Rails
```bash
# Heroku
git push heroku main
heroku run rails db:migrate
```

### Django
```bash
# Heroku
git push heroku main
heroku run python manage.py migrate
```

---

## Final Recommendation

**For IFM MVP, we recommend Django** because:

1. **Built-in Admin** - Saves weeks of development time
2. **Django REST Framework** - Best REST API framework available
3. **Type Safety** - Python type hints improve code quality
4. **Data-Heavy Application** - Django excels at complex data models
5. **Team Flexibility** - Python is more widely known than Ruby

However, **both are excellent choices** and the decision should ultimately be based on your team's expertise and preferences.

---

## Next Steps

### If Choosing Django:
1. Review `PYTHON-BACKEND-OVERVIEW.md`
2. Set up development environment
3. Implement models from `PYTHON-MODELS.md`
4. Build API from `PYTHON-API.md`
5. Implement business logic from `PYTHON-BUSINESS-LOGIC.md`

### If Choosing Rails:
1. Review `TECHNICAL-SPEC.md`
2. Set up Rails application
3. Implement models from `01-DATA-SCHEMA.md`
4. Build API from `02-API-REQUIREMENTS.md`
5. Implement business logic

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
