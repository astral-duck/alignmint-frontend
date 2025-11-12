# Python/Django Backend - Business Logic & Services

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Framework:** Django 5.0+  

---

## Table of Contents

1. [Service Layer Pattern](#service-layer-pattern)
2. [Journal Entry Service](#journal-entry-service)
3. [Ledger Service](#ledger-service)
4. [Donation Processing Service](#donation-processing-service)
5. [Reconciliation Service](#reconciliation-service)
6. [Report Generation Service](#report-generation-service)
7. [Celery Tasks](#celery-tasks)

---

## Service Layer Pattern

### Why Use Services?

Keep business logic **out of views and models**:

- ✅ **Reusability**: Use same logic in views, tasks, management commands
- ✅ **Testability**: Easy to unit test without HTTP requests
- ✅ **Maintainability**: Business logic in one place
- ✅ **Transaction Management**: Atomic operations with `@transaction.atomic`

### Service Structure

```python
# apps/accounting/services/journal_entry.py
from django.db import transaction
from decimal import Decimal

class JournalEntryService:
    """Service for journal entry operations"""
    
    @staticmethod
    @transaction.atomic
    def create_entry(organization, entry_date, description, lines, **kwargs):
        """Create journal entry with validation"""
        # Business logic here
        pass
    
    @staticmethod
    @transaction.atomic
    def post_entry(journal_entry):
        """Post entry to general ledger"""
        # Business logic here
        pass
```

---

## Journal Entry Service

### Complete Implementation

```python
# apps/accounting/services/journal_entry.py
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from ..models import JournalEntry, JournalEntryLine, LedgerEntry
from .ledger import LedgerService

class JournalEntryService:
    """
    Service for creating and posting journal entries
    
    🔴 CRITICAL: ALL financial transactions MUST flow through journal entries
    This enforces double-entry accounting and maintains audit trail
    """
    
    @staticmethod
    @transaction.atomic
    def create_entry(organization, entry_date, description, lines, 
                     reference_type=None, reference_id=None, created_by=None):
        """
        Create a journal entry with double-entry validation
        
        Args:
            organization: Organization instance
            entry_date: Date of entry
            description: Entry description
            lines: List of dicts with:
                {
                    'account_id': UUID,
                    'debit_amount': Decimal,
                    'credit_amount': Decimal,
                    'description': str (optional)
                }
            reference_type: Optional ('donation', 'expense', 'reimbursement', etc.)
            reference_id: Optional UUID of source transaction
            created_by: User instance
        
        Returns:
            JournalEntry instance
        
        Raises:
            ValueError: If debits != credits
        """
        # Validate double-entry accounting
        total_debits = sum(Decimal(str(line['debit_amount'])) for line in lines)
        total_credits = sum(Decimal(str(line['credit_amount'])) for line in lines)
        
        if total_debits != total_credits:
            raise ValueError(
                f"Debits ({total_debits}) must equal credits ({total_credits}). "
                f"Difference: {abs(total_debits - total_credits)}"
            )
        
        # Validate at least 2 lines
        if len(lines) < 2:
            raise ValueError("Journal entry must have at least 2 lines")
        
        # Generate entry number
        entry_number = JournalEntryService._generate_entry_number(
            organization, 
            entry_date
        )
        
        # Create journal entry
        journal_entry = JournalEntry.objects.create(
            organization=organization,
            entry_date=entry_date,
            entry_number=entry_number,
            description=description,
            reference_type=reference_type,
            reference_id=reference_id,
            status='draft',
            created_by=created_by
        )
        
        # Create lines
        for line in lines:
            JournalEntryLine.objects.create(
                journal_entry=journal_entry,
                account_id=line['account_id'],
                description=line.get('description', description),
                debit_amount=Decimal(str(line['debit_amount'])),
                credit_amount=Decimal(str(line['credit_amount']))
            )
        
        return journal_entry
    
    @staticmethod
    @transaction.atomic
    def post_entry(journal_entry):
        """
        Post journal entry to general ledger
        
        This creates ledger entries and updates running balances
        
        Args:
            journal_entry: JournalEntry instance
        
        Returns:
            JournalEntry instance (updated)
        
        Raises:
            ValueError: If entry already posted or validation fails
        """
        if journal_entry.status == 'posted':
            raise ValueError("Journal entry already posted")
        
        if journal_entry.status == 'voided':
            raise ValueError("Cannot post voided journal entry")
        
        # Re-validate double-entry
        total_debits = sum(line.debit_amount for line in journal_entry.lines.all())
        total_credits = sum(line.credit_amount for line in journal_entry.lines.all())
        
        if total_debits != total_credits:
            raise ValueError(
                f"Debits ({total_debits}) must equal credits ({total_credits})"
            )
        
        # Create ledger entries for each line
        for line in journal_entry.lines.all():
            # Calculate running balance
            running_balance = LedgerService.calculate_running_balance(
                account=line.account,
                transaction_date=journal_entry.entry_date,
                debit_amount=line.debit_amount,
                credit_amount=line.credit_amount
            )
            
            LedgerEntry.objects.create(
                organization=journal_entry.organization,
                journal_entry=journal_entry,
                account=line.account,
                transaction_date=journal_entry.entry_date,
                description=line.description,
                transaction_type='journal_entry',
                debit_amount=line.debit_amount,
                credit_amount=line.credit_amount,
                running_balance=running_balance
            )
        
        # Update status
        journal_entry.status = 'posted'
        journal_entry.posted_at = timezone.now()
        journal_entry.save()
        
        return journal_entry
    
    @staticmethod
    @transaction.atomic
    def void_entry(journal_entry, voided_by, reason):
        """
        Void a posted journal entry by creating reversing entry
        
        Args:
            journal_entry: JournalEntry to void
            voided_by: User performing the void
            reason: Reason for voiding
        
        Returns:
            Tuple of (original_entry, reversing_entry)
        """
        if journal_entry.status != 'posted':
            raise ValueError("Can only void posted entries")
        
        # Create reversing entry
        reversing_lines = []
        for line in journal_entry.lines.all():
            reversing_lines.append({
                'account_id': line.account_id,
                'debit_amount': line.credit_amount,  # Swap debits and credits
                'credit_amount': line.debit_amount,
                'description': f"VOID: {line.description}"
            })
        
        reversing_entry = JournalEntryService.create_entry(
            organization=journal_entry.organization,
            entry_date=timezone.now().date(),
            description=f"VOID: {journal_entry.description} - {reason}",
            lines=reversing_lines,
            reference_type='void',
            reference_id=journal_entry.id,
            created_by=voided_by
        )
        
        # Post reversing entry
        JournalEntryService.post_entry(reversing_entry)
        
        # Mark original as voided
        journal_entry.status = 'voided'
        journal_entry.save()
        
        return (journal_entry, reversing_entry)
    
    @staticmethod
    def _generate_entry_number(organization, entry_date):
        """Generate sequential entry number: JE-YYYY-00001"""
        year = entry_date.year
        count = JournalEntry.objects.filter(
            organization=organization,
            entry_date__year=year
        ).count() + 1
        return f"JE-{year}-{count:05d}"
```

---

## Ledger Service

```python
# apps/accounting/services/ledger.py
from decimal import Decimal
from django.db.models import Sum, Q
from ..models import LedgerEntry, Account

class LedgerService:
    """Service for general ledger operations"""
    
    @staticmethod
    def calculate_running_balance(account, transaction_date, debit_amount, credit_amount):
        """
        Calculate running balance for an account
        
        Args:
            account: Account instance
            transaction_date: Date of transaction
            debit_amount: Debit amount
            credit_amount: Credit amount
        
        Returns:
            Decimal: New running balance
        """
        # Get previous balance
        previous_entry = LedgerEntry.objects.filter(
            account=account,
            transaction_date__lte=transaction_date
        ).order_by('-transaction_date', '-created_at').first()
        
        previous_balance = previous_entry.running_balance if previous_entry else Decimal('0')
        
        # Calculate new balance based on account type
        # Debit accounts (Assets, Expenses): increase with debits
        # Credit accounts (Liabilities, Equity, Revenue): increase with credits
        if account.normal_balance == 'debit':
            new_balance = previous_balance + debit_amount - credit_amount
        else:
            new_balance = previous_balance + credit_amount - debit_amount
        
        return new_balance
    
    @staticmethod
    def get_account_balance(account, as_of_date=None):
        """
        Get current balance for an account
        
        Args:
            account: Account instance
            as_of_date: Optional date (defaults to today)
        
        Returns:
            Decimal: Account balance
        """
        query = LedgerEntry.objects.filter(account=account)
        
        if as_of_date:
            query = query.filter(transaction_date__lte=as_of_date)
        
        latest = query.order_by('-transaction_date', '-created_at').first()
        return latest.running_balance if latest else Decimal('0')
    
    @staticmethod
    def get_account_summary(account, start_date=None, end_date=None):
        """
        Get account summary with debits, credits, and balance
        
        Returns:
            Dict with 'beginning_balance', 'total_debits', 'total_credits', 'ending_balance'
        """
        entries = LedgerEntry.objects.filter(account=account)
        
        # Beginning balance
        if start_date:
            beginning_entry = entries.filter(
                transaction_date__lt=start_date
            ).order_by('-transaction_date', '-created_at').first()
            beginning_balance = beginning_entry.running_balance if beginning_entry else Decimal('0')
            entries = entries.filter(transaction_date__gte=start_date)
        else:
            beginning_balance = Decimal('0')
        
        # Filter by end date
        if end_date:
            entries = entries.filter(transaction_date__lte=end_date)
        
        # Calculate totals
        aggregates = entries.aggregate(
            total_debits=Sum('debit_amount'),
            total_credits=Sum('credit_amount')
        )
        
        total_debits = aggregates['total_debits'] or Decimal('0')
        total_credits = aggregates['total_credits'] or Decimal('0')
        
        # Ending balance
        if account.normal_balance == 'debit':
            ending_balance = beginning_balance + total_debits - total_credits
        else:
            ending_balance = beginning_balance + total_credits - total_debits
        
        return {
            'beginning_balance': beginning_balance,
            'total_debits': total_debits,
            'total_credits': total_credits,
            'ending_balance': ending_balance
        }
```

---

## Donation Processing Service

```python
# apps/donations/services.py
from django.db import transaction
from decimal import Decimal
import stripe
from ..models import Donation
from apps.accounting.services.journal_entry import JournalEntryService

class DonationService:
    """Service for processing donations"""
    
    @staticmethod
    @transaction.atomic
    def process_donation(donation):
        """
        Process a donation and create accounting entries
        
        Flow:
        1. Process payment (Stripe, check, cash, etc.)
        2. Create journal entry (debit cash, credit revenue)
        3. Post journal entry to ledger
        4. Update donation status
        5. Send receipt
        
        Args:
            donation: Donation instance
        
        Returns:
            Donation instance (updated)
        """
        # Process payment based on method
        if donation.payment_method == 'credit_card':
            DonationService._process_stripe_payment(donation)
        elif donation.payment_method == 'check':
            # Check processing happens in CheckDepositManager
            donation.payment_status = 'pending'
        elif donation.payment_method == 'cash':
            donation.payment_status = 'completed'
        
        # Create journal entry if payment completed
        if donation.payment_status == 'completed':
            DonationService._create_journal_entry(donation)
        
        donation.save()
        return donation
    
    @staticmethod
    def _process_stripe_payment(donation):
        """Process credit card payment via Stripe"""
        try:
            # Create Stripe charge
            charge = stripe.Charge.create(
                amount=int(donation.amount * 100),  # Convert to cents
                currency=donation.currency.lower(),
                source=donation.stripe_token,  # From frontend
                description=f"Donation from {donation.donor.full_name}",
                metadata={
                    'donation_id': str(donation.id),
                    'donor_id': str(donation.donor.id),
                    'organization_id': str(donation.organization.id)
                }
            )
            
            donation.transaction_id = charge.id
            donation.payment_status = 'completed'
            
        except stripe.error.CardError as e:
            donation.payment_status = 'failed'
            donation.notes = f"Payment failed: {str(e)}"
    
    @staticmethod
    def _create_journal_entry(donation):
        """
        Create journal entry for donation
        
        Debit: Cash/Checking Account
        Credit: Donation Revenue
        """
        from apps.accounting.models import Account
        
        # Get accounts (these should be configurable per organization)
        cash_account = Account.objects.get(
            organization=donation.organization,
            account_number='1000'  # Checking Account
        )
        revenue_account = Account.objects.get(
            organization=donation.organization,
            account_number='4000'  # Donation Revenue
        )
        
        # Create journal entry
        lines = [
            {
                'account_id': cash_account.id,
                'debit_amount': donation.amount,
                'credit_amount': Decimal('0'),
                'description': f"Donation from {donation.donor.full_name}"
            },
            {
                'account_id': revenue_account.id,
                'debit_amount': Decimal('0'),
                'credit_amount': donation.amount,
                'description': f"Donation from {donation.donor.full_name}"
            }
        ]
        
        journal_entry = JournalEntryService.create_entry(
            organization=donation.organization,
            entry_date=donation.donation_date,
            description=f"Donation from {donation.donor.full_name}",
            lines=lines,
            reference_type='donation',
            reference_id=donation.id
        )
        
        # Post immediately
        JournalEntryService.post_entry(journal_entry)
        
        # Link to donation
        donation.journal_entry = journal_entry
    
    @staticmethod
    @transaction.atomic
    def refund_donation(donation):
        """
        Refund a donation
        
        Creates reversing journal entry and processes Stripe refund
        """
        if donation.payment_status != 'completed':
            raise ValueError("Can only refund completed donations")
        
        # Process Stripe refund
        if donation.payment_method == 'credit_card' and donation.transaction_id:
            stripe.Refund.create(charge=donation.transaction_id)
        
        # Void the journal entry
        if donation.journal_entry:
            from apps.accounting.services.journal_entry import JournalEntryService
            JournalEntryService.void_entry(
                journal_entry=donation.journal_entry,
                voided_by=None,  # System void
                reason=f"Donation refund for {donation.donor.full_name}"
            )
        
        # Update donation status
        donation.payment_status = 'refunded'
        donation.save()
        
        return donation


class ReceiptService:
    """Service for generating and sending donation receipts"""
    
    @staticmethod
    def send_receipt(donation):
        """Generate and email donation receipt"""
        from django.core.mail import EmailMessage
        from django.template.loader import render_to_string
        
        # Generate receipt HTML
        html_content = render_to_string('emails/donation_receipt.html', {
            'donation': donation,
            'donor': donation.donor,
            'organization': donation.organization
        })
        
        # Send email
        email = EmailMessage(
            subject=f"Donation Receipt - {donation.organization.name}",
            body=html_content,
            from_email='receipts@infocusministries.org',
            to=[donation.donor.email]
        )
        email.content_subtype = 'html'
        email.send()
        
        # Update donation
        from django.utils import timezone
        donation.receipt_sent = True
        donation.receipt_sent_at = timezone.now()
        donation.save()
```

---

## Reconciliation Service

```python
# apps/accounting/services/reconciliation.py
from django.db import transaction
from decimal import Decimal
from ..models import Reconciliation, LedgerEntry

class ReconciliationService:
    """Service for bank reconciliation"""
    
    @staticmethod
    @transaction.atomic
    def create_reconciliation(account, statement_date, statement_balance):
        """
        Create a new reconciliation
        
        Args:
            account: Account to reconcile
            statement_date: Bank statement date
            statement_balance: Ending balance from statement
        
        Returns:
            Reconciliation instance
        """
        reconciliation = Reconciliation.objects.create(
            organization=account.organization,
            account=account,
            statement_date=statement_date,
            statement_balance=statement_balance,
            status='in_progress'
        )
        
        return reconciliation
    
    @staticmethod
    @transaction.atomic
    def match_transaction(reconciliation, ledger_entry):
        """Mark a ledger entry as reconciled"""
        ledger_entry.reconciled = True
        ledger_entry.reconciliation = reconciliation
        ledger_entry.save()
    
    @staticmethod
    def calculate_reconciliation_difference(reconciliation):
        """
        Calculate difference between statement and ledger
        
        Returns:
            Dict with 'ledger_balance', 'statement_balance', 'difference'
        """
        # Get reconciled entries
        reconciled_entries = LedgerEntry.objects.filter(
            reconciliation=reconciliation
        )
        
        # Calculate ledger balance
        ledger_balance = Decimal('0')
        for entry in reconciled_entries:
            if entry.account.normal_balance == 'debit':
                ledger_balance += entry.debit_amount - entry.credit_amount
            else:
                ledger_balance += entry.credit_amount - entry.debit_amount
        
        difference = reconciliation.statement_balance - ledger_balance
        
        return {
            'ledger_balance': ledger_balance,
            'statement_balance': reconciliation.statement_balance,
            'difference': difference
        }
    
    @staticmethod
    @transaction.atomic
    def complete_reconciliation(reconciliation):
        """Complete reconciliation if balanced"""
        result = ReconciliationService.calculate_reconciliation_difference(reconciliation)
        
        if result['difference'] != Decimal('0'):
            raise ValueError(
                f"Reconciliation not balanced. Difference: {result['difference']}"
            )
        
        reconciliation.status = 'completed'
        reconciliation.save()
        
        return reconciliation
```

---

## Report Generation Service

```python
# apps/reports/services/balance_sheet.py
from decimal import Decimal
from apps.accounting.models import Account
from apps.accounting.services.ledger import LedgerService

class BalanceSheetService:
    """Service for generating balance sheet reports"""
    
    @staticmethod
    def generate(organization, as_of_date=None):
        """
        Generate balance sheet
        
        Returns:
            Dict with 'assets', 'liabilities', 'equity', 'total_assets', etc.
        """
        accounts = Account.objects.filter(
            organization=organization,
            is_active=True
        ).order_by('account_number')
        
        # Group accounts by type
        assets = []
        liabilities = []
        equity = []
        
        for account in accounts:
            balance = LedgerService.get_account_balance(account, as_of_date)
            
            account_data = {
                'account_number': account.account_number,
                'account_name': account.account_name,
                'balance': balance
            }
            
            if account.account_type == 'asset':
                assets.append(account_data)
            elif account.account_type == 'liability':
                liabilities.append(account_data)
            elif account.account_type == 'equity':
                equity.append(account_data)
        
        # Calculate totals
        total_assets = sum(a['balance'] for a in assets)
        total_liabilities = sum(l['balance'] for l in liabilities)
        total_equity = sum(e['balance'] for e in equity)
        
        return {
            'as_of_date': as_of_date,
            'assets': assets,
            'liabilities': liabilities,
            'equity': equity,
            'total_assets': total_assets,
            'total_liabilities': total_liabilities,
            'total_equity': total_equity,
            'balanced': (total_assets == total_liabilities + total_equity)
        }
```

---

## Celery Tasks

```python
# apps/donations/tasks.py
from celery import shared_task
from .models import RecurringDonation, Donation
from .services import DonationService
from django.utils import timezone

@shared_task
def process_recurring_donations():
    """
    Process recurring donations that are due
    Run daily via Celery Beat
    """
    today = timezone.now().date()
    
    # Get active recurring donations due today
    recurring = RecurringDonation.objects.filter(
        status='active',
        next_donation_date__lte=today
    )
    
    for rec in recurring:
        # Create donation
        donation = Donation.objects.create(
            organization=rec.organization,
            donor=rec.donor,
            amount=rec.amount,
            donation_date=today,
            donation_type='recurring',
            payment_method=rec.payment_method,
            payment_status='pending'
        )
        
        # Process payment
        DonationService.process_donation(donation)
        
        # Update next donation date
        if rec.frequency == 'monthly':
            from dateutil.relativedelta import relativedelta
            rec.next_donation_date = today + relativedelta(months=1)
        elif rec.frequency == 'weekly':
            from datetime import timedelta
            rec.next_donation_date = today + timedelta(days=7)
        
        rec.save()


@shared_task
def send_donation_receipts():
    """
    Send receipts for donations that haven't been sent
    Run hourly
    """
    from .services import ReceiptService
    
    donations = Donation.objects.filter(
        payment_status='completed',
        receipt_sent=False
    )
    
    for donation in donations:
        ReceiptService.send_receipt(donation)
```

---

## Related Documentation

- **Overview**: `PYTHON-BACKEND-OVERVIEW.md` - Setup
- **Models**: `PYTHON-MODELS.md` - Database models
- **API**: `PYTHON-API.md` - ViewSets and serializers
- **Frontend Integration**: `02-API-REQUIREMENTS.md` - API endpoints

---

**Last Updated:** November 12, 2025  
**Maintained By:** IFM MVP Development Team
