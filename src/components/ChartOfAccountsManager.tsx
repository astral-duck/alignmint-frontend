import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PageHeader } from './PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Building,
  DollarSign,
  Landmark,
} from 'lucide-react';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

interface AccountCategory {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  description: string;
  isActive: boolean;
  parentId?: string;
}

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings' | 'credit';
  balance: number;
  isActive: boolean;
}

// Mock data - Using actual codes from General Ledger
const generateMockAccounts = (): AccountCategory[] => {
  return [
    // Assets
    { id: 'ACC-001', code: '1000', name: 'Cash and Cash Equivalents', type: 'asset', description: 'All cash accounts and equivalents', isActive: true },
    { id: 'ACC-002', code: '1100', name: 'Checking Accounts', type: 'asset', description: 'Operating checking accounts', isActive: true },
    { id: 'ACC-003', code: '1200', name: 'Savings Accounts', type: 'asset', description: 'Reserve savings accounts', isActive: true },
    { id: 'ACC-004', code: '1300', name: 'Accounts Receivable', type: 'asset', description: 'Money owed to organization', isActive: true },
    { id: 'ACC-005', code: '1400', name: 'Pledges Receivable', type: 'asset', description: 'Committed donations not yet received', isActive: true },
    { id: 'ACC-006', code: '1500', name: 'Prepaid Expenses', type: 'asset', description: 'Expenses paid in advance', isActive: true },
    
    // Liabilities
    { id: 'ACC-020', code: '2000', name: 'Accounts Payable', type: 'liability', description: 'Money owed to vendors', isActive: true },
    { id: 'ACC-021', code: '2100', name: 'Accrued Expenses', type: 'liability', description: 'Expenses incurred but not yet paid', isActive: true },
    { id: 'ACC-022', code: '2200', name: 'Deferred Revenue', type: 'liability', description: 'Payments received in advance', isActive: true },
    { id: 'ACC-023', code: '2300', name: 'Loans Payable', type: 'liability', description: 'Outstanding loans', isActive: true },
    
    // Equity
    { id: 'ACC-030', code: '3000', name: 'Net Assets Without Restrictions', type: 'equity', description: 'Unrestricted funds', isActive: true },
    { id: 'ACC-031', code: '3100', name: 'Net Assets With Restrictions', type: 'equity', description: 'Donor-restricted funds', isActive: true },
    { id: 'ACC-032', code: '3200', name: 'Retained Earnings', type: 'equity', description: 'Accumulated surplus', isActive: true },
    
    // Revenue
    { id: 'ACC-040', code: '4000', name: 'Donations', type: 'revenue', description: 'Individual and corporate donations', isActive: true },
    { id: 'ACC-041', code: '4100', name: 'Earned Income', type: 'revenue', description: 'Program fees, membership dues, event revenue', isActive: true },
    { id: 'ACC-042', code: '4300', name: 'Grants', type: 'revenue', description: 'Foundation and government grants', isActive: true },
    
    // Expenses - Compensation
    { id: 'ACC-050', code: '5100', name: 'Compensation - Officers and Directors', type: 'expense', description: 'Executive and director salaries', isActive: true },
    { id: 'ACC-051', code: '5110', name: 'Compensation - all others', type: 'expense', description: 'Staff salaries and wages', isActive: true },
    { id: 'ACC-052', code: '5130', name: 'Other Employee Benefits', type: 'expense', description: 'Health insurance, 401k, benefits', isActive: true },
    { id: 'ACC-053', code: '5140', name: 'Payroll Taxes', type: 'expense', description: 'FICA, unemployment, payroll taxes', isActive: true },
    { id: 'ACC-054', code: '5160', name: 'Staff Development', type: 'expense', description: 'Training and professional development', isActive: true },
    
    // Expenses - Professional Services
    { id: 'ACC-060', code: '5200', name: 'Legal Fees', type: 'expense', description: 'Legal consultation and services', isActive: true },
    { id: 'ACC-061', code: '5210', name: 'Accounting', type: 'expense', description: 'Accounting, bookkeeping, tax prep, audit', isActive: true },
    { id: 'ACC-062', code: '5240', name: 'Advertising Expenses', type: 'expense', description: 'Marketing and advertising costs', isActive: true },
    
    // Expenses - Office & Operations
    { id: 'ACC-070', code: '5300', name: 'Office Supplies', type: 'expense', description: 'General office supplies', isActive: true },
    { id: 'ACC-071', code: '5310', name: 'Furniture & Equipment', type: 'expense', description: 'Office furniture and equipment purchases', isActive: true },
    { id: 'ACC-072', code: '5320', name: 'Postage, Mailing Service', type: 'expense', description: 'Postage and shipping expenses', isActive: true },
    { id: 'ACC-073', code: '5400', name: 'Information Technology', type: 'expense', description: 'IT support, hosting, cybersecurity', isActive: true },
    { id: 'ACC-074', code: '5410', name: 'Software Programs', type: 'expense', description: 'Software subscriptions and licenses', isActive: true },
    
    // Expenses - Facilities
    { id: 'ACC-080', code: '5500', name: 'Rent', type: 'expense', description: 'Office rent and space rental', isActive: true },
    { id: 'ACC-081', code: '5510', name: 'Utilities', type: 'expense', description: 'Electricity, water, gas, trash', isActive: true },
    { id: 'ACC-082', code: '5520', name: 'Telephone, Telecommunications', type: 'expense', description: 'Phone, internet, communication services', isActive: true },
    { id: 'ACC-083', code: '5530', name: 'Repairs and Maintenance - Domestic', type: 'expense', description: 'Building repairs and maintenance', isActive: true },
    
    // Expenses - Travel & Meetings
    { id: 'ACC-090', code: '5600', name: 'Travel and Meetings', type: 'expense', description: 'Flights, hotels, conference fees', isActive: true },
    { id: 'ACC-091', code: '5610', name: 'Transportation', type: 'expense', description: 'Mileage, gas, uber, tolls', isActive: true },
    { id: 'ACC-092', code: '5620', name: 'Parking', type: 'expense', description: 'Parking fees', isActive: true },
    { id: 'ACC-093', code: '5660', name: 'Meals', type: 'expense', description: 'Business meals and catering', isActive: true },
    
    // Expenses - Insurance
    { id: 'ACC-100', code: '5700', name: 'Insurance Premium', type: 'expense', description: 'Property, equipment, workers comp insurance', isActive: true },
    { id: 'ACC-101', code: '5710', name: 'Insurance - Liability, D and O', type: 'expense', description: 'Liability and directors & officers insurance', isActive: true },
    
    // Expenses - Other
    { id: 'ACC-110', code: '5800', name: 'Bank Fees', type: 'expense', description: 'Bank service and processing fees', isActive: true },
    { id: 'ACC-111', code: '5830', name: 'Materials', type: 'expense', description: 'Program materials and supplies', isActive: true },
    { id: 'ACC-112', code: '5840', name: 'Outside Contract Services', type: 'expense', description: 'Contract workers and consulting services', isActive: true },
    { id: 'ACC-113', code: '5900', name: 'IFM Admin fee', type: 'expense', description: 'InFocus Ministries administrative fee', isActive: true },
  ];
};

const generateMockBankAccounts = (): BankAccount[] => {
  return [
    {
      id: 'BANK-001',
      accountName: 'Operating Checking',
      bankName: 'First National Bank',
      accountNumber: '****1234',
      routingNumber: '123456789',
      accountType: 'checking',
      balance: 125430.50,
      isActive: true,
    },
    {
      id: 'BANK-002',
      accountName: 'Reserve Savings',
      bankName: 'Community Bank',
      accountNumber: '****5678',
      routingNumber: '987654321',
      accountType: 'savings',
      balance: 350000.00,
      isActive: true,
    },
    {
      id: 'BANK-003',
      accountName: 'Program Account',
      bankName: 'First National Bank',
      accountNumber: '****9012',
      routingNumber: '123456789',
      accountType: 'checking',
      balance: 48750.25,
      isActive: true,
    },
    {
      id: 'BANK-004',
      accountName: 'Credit Card',
      bankName: 'Bank of America',
      accountNumber: '****3456',
      routingNumber: '',
      accountType: 'credit',
      balance: -2450.00,
      isActive: true,
    },
  ];
};

export const ChartOfAccountsManager: React.FC = () => {
  const { setAdministrationTool } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<AccountCategory[]>(generateMockAccounts());
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(generateMockBankAccounts());
  
  // Account dialog state
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountCategory | null>(null);
  const [accountForm, setAccountForm] = useState({
    code: '',
    name: '',
    type: 'asset' as AccountType,
    description: '',
    isActive: true,
  });
  
  // Bank account dialog state
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [bankMethodDialogOpen, setBankMethodDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankForm, setBankForm] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking' as 'checking' | 'savings' | 'credit',
    balance: 0,
    isActive: true,
  });
  
  // Delete dialogs
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [deleteBankDialog, setDeleteBankDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Filter accounts by search
  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts;
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.code.includes(searchQuery) ||
        account.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accounts, searchQuery]);

  // Group accounts by type
  const accountsByType = useMemo(() => {
    const grouped: Record<AccountType, AccountCategory[]> = {
      asset: [],
      liability: [],
      equity: [],
      revenue: [],
      expense: [],
    };
    
    filteredAccounts.forEach((account) => {
      grouped[account.type].push(account);
    });
    
    return grouped;
  }, [filteredAccounts]);

  // Handlers for accounts
  const openAddAccountDialog = () => {
    setEditingAccount(null);
    setAccountForm({
      code: '',
      name: '',
      type: 'asset',
      description: '',
      isActive: true,
    });
    setAccountDialogOpen(true);
  };

  const openEditAccountDialog = (account: AccountCategory) => {
    setEditingAccount(account);
    setAccountForm({
      code: account.code,
      name: account.name,
      type: account.type,
      description: account.description,
      isActive: account.isActive,
    });
    setAccountDialogOpen(true);
  };

  const handleSaveAccount = () => {
    if (!accountForm.code || !accountForm.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingAccount) {
      setAccounts(accounts.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...accountForm }
          : acc
      ));
      toast.success('Account updated successfully');
    } else {
      const newAccount: AccountCategory = {
        id: `ACC-${String(accounts.length + 1).padStart(3, '0')}`,
        ...accountForm,
      };
      setAccounts([...accounts, newAccount]);
      toast.success('Account added successfully');
    }
    
    setAccountDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    if (itemToDelete) {
      setAccounts(accounts.filter(acc => acc.id !== itemToDelete));
      toast.success('Account deleted successfully');
      setDeleteAccountDialog(false);
      setItemToDelete(null);
    }
  };

  // Handlers for bank accounts
  const openAddBankDialog = () => {
    setEditingBank(null);
    setBankMethodDialogOpen(true);
  };

  const handleBankMethodSelection = (method: 'plaid' | 'manual') => {
    setBankMethodDialogOpen(false);
    
    if (method === 'plaid') {
      // Simulate Plaid connection
      toast.success('Plaid integration coming soon! Using manual entry for now.');
      openManualBankEntry();
    } else {
      openManualBankEntry();
    }
  };

  const openManualBankEntry = () => {
    setBankForm({
      accountName: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking',
      balance: 0,
      isActive: true,
    });
    setBankDialogOpen(true);
  };

  const openEditBankDialog = (bank: BankAccount) => {
    setEditingBank(bank);
    setBankForm({
      accountName: bank.accountName,
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      routingNumber: bank.routingNumber,
      accountType: bank.accountType,
      balance: bank.balance,
      isActive: bank.isActive,
    });
    setBankDialogOpen(true);
  };

  const handleSaveBank = () => {
    if (!bankForm.accountName || !bankForm.bankName || !bankForm.accountNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingBank) {
      setBankAccounts(bankAccounts.map(bank => 
        bank.id === editingBank.id 
          ? { ...bank, ...bankForm }
          : bank
      ));
      toast.success('Bank account updated successfully');
    } else {
      const newBank: BankAccount = {
        id: `BANK-${String(bankAccounts.length + 1).padStart(3, '0')}`,
        ...bankForm,
      };
      setBankAccounts([...bankAccounts, newBank]);
      toast.success('Bank account added successfully');
    }
    
    setBankDialogOpen(false);
  };

  const handleDeleteBank = () => {
    if (itemToDelete) {
      setBankAccounts(bankAccounts.filter(bank => bank.id !== itemToDelete));
      toast.success('Bank account deleted successfully');
      setDeleteBankDialog(false);
      setItemToDelete(null);
    }
  };

  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case 'asset':
        return <Wallet className="h-4 w-4" />;
      case 'liability':
        return <TrendingDown className="h-4 w-4" />;
      case 'equity':
        return <Building className="h-4 w-4" />;
      case 'revenue':
        return <TrendingUp className="h-4 w-4" />;
      case 'expense':
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getAccountTypeBadge = (type: AccountType) => {
    const colors = {
      asset: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      liability: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      equity: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      revenue: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
      expense: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    };
    
    return (
      <Badge className={`${colors[type]} gap-1`}>
        {getAccountTypeIcon(type)}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getBankAccountTypeBadge = (type: 'checking' | 'savings' | 'credit') => {
    const colors = {
      checking: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      savings: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
      credit: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    };
    
    return <Badge className={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setAdministrationTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Administration Hub
      </Button>

      {/* Header */}
      <PageHeader 
        title="Chart of Accounts"
        subtitle="Manage account categories and bank accounts for your organization"
      />

      {/* Tabs */}
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="accounts">Account Categories</TabsTrigger>
          <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
        </TabsList>

        {/* Account Categories Tab */}
        <TabsContent value="accounts" className="space-y-4">
          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2 w-full sm:w-auto" onClick={openAddAccountDialog}>
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {(['asset', 'liability', 'equity', 'revenue', 'expense'] as AccountType[]).map((type) => (
              <Card key={type}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      type === 'asset' ? 'bg-blue-100 dark:bg-blue-950' :
                      type === 'liability' ? 'bg-red-100 dark:bg-red-950' :
                      type === 'equity' ? 'bg-purple-100 dark:bg-purple-950' :
                      type === 'revenue' ? 'bg-green-100 dark:bg-green-950' :
                      'bg-orange-100 dark:bg-orange-950'
                    }`}>
                      {getAccountTypeIcon(type)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{type}</p>
                      <p className="text-2xl">{accountsByType[type].length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Accounts Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Code</TableHead>
                      <TableHead className="min-w-[200px]">Name</TableHead>
                      <TableHead className="min-w-[120px]">Type</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[250px]">Description</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                          No accounts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-mono text-sm">{account.code}</TableCell>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>{getAccountTypeBadge(account.type)}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                            {account.description}
                          </TableCell>
                          <TableCell>
                            {account.isActive ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditAccountDialog(account)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete(account.id);
                                  setDeleteAccountDialog(true);
                                }}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Accounts Tab */}
        <TabsContent value="banks" className="space-y-4">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl">Bank Accounts</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your organization's bank accounts
              </p>
            </div>
            <Button className="gap-2" onClick={openAddBankDialog}>
              <Plus className="h-4 w-4" />
              Add Bank Account
            </Button>
          </div>

          {/* Bank Accounts Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((bank) => (
              <Card key={bank.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                        <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{bank.accountName}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{bank.bankName}</p>
                      </div>
                    </div>
                    {getBankAccountTypeBadge(bank.accountType)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Account Number</p>
                      <p className="font-mono">{bank.accountNumber}</p>
                    </div>
                    {bank.routingNumber && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Routing Number</p>
                        <p className="font-mono">{bank.routingNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                      <p className={`text-2xl ${bank.balance < 0 ? 'text-red-600' : ''}`}>
                        ${bank.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditBankDialog(bank)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setItemToDelete(bank.id);
                          setDeleteBankDialog(true);
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Account Dialog */}
      <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Account'}</DialogTitle>
            <DialogDescription>
              {editingAccount ? 'Update the account details below.' : 'Create a new account category.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Account Code *</Label>
              <Input
                id="code"
                placeholder="1000"
                value={accountForm.code}
                onChange={(e) => setAccountForm({ ...accountForm, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Account Name *</Label>
              <Input
                id="name"
                placeholder="Cash and Cash Equivalents"
                value={accountForm.name}
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Account Type *</Label>
              <Select
                value={accountForm.type}
                onValueChange={(value: AccountType) => setAccountForm({ ...accountForm, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Asset</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this account category..."
                value={accountForm.description}
                onChange={(e) => setAccountForm({ ...accountForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={accountForm.isActive ? 'active' : 'inactive'}
                onValueChange={(value) => setAccountForm({ ...accountForm, isActive: value === 'active' })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccount}>
              {editingAccount ? 'Update' : 'Create'} Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bank Account Method Selection Dialog */}
      <Dialog open={bankMethodDialogOpen} onOpenChange={setBankMethodDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Choose how you would like to connect your bank account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            {/* Plaid Option */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500"
              onClick={() => handleBankMethodSelection('plaid')}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                    <Landmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Connect with Plaid</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Securely connect your bank account in seconds. Automatically sync transactions and balances.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                        Recommended
                      </Badge>
                      <Badge variant="outline">Automatic sync</Badge>
                      <Badge variant="outline">Bank-level security</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Option */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-gray-500"
              onClick={() => handleBankMethodSelection('manual')}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Edit className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Manual Entry</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Enter your bank account details manually. You'll need to update transactions and balances yourself.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Manual updates</Badge>
                      <Badge variant="outline">Full control</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBankMethodDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bank Account Dialog */}
      <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBank ? 'Edit Bank Account' : 'Add Bank Account - Manual Entry'}</DialogTitle>
            <DialogDescription>
              {editingBank ? 'Update the bank account details below.' : 'Enter your bank account details manually.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                placeholder="Operating Checking"
                value={bankForm.accountName}
                onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                placeholder="First National Bank"
                value={bankForm.bankName}
                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                placeholder="****1234"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                placeholder="123456789"
                value={bankForm.routingNumber}
                onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={bankForm.accountType}
                onValueChange={(value: 'checking' | 'savings' | 'credit') => 
                  setBankForm({ ...bankForm, accountType: value })
                }
              >
                <SelectTrigger id="accountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={bankForm.balance}
                onChange={(e) => setBankForm({ ...bankForm, balance: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankStatus">Status</Label>
              <Select
                value={bankForm.isActive ? 'active' : 'inactive'}
                onValueChange={(value) => setBankForm({ ...bankForm, isActive: value === 'active' })}
              >
                <SelectTrigger id="bankStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBankDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBank}>
              {editingBank ? 'Update' : 'Add'} Bank Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Bank Account Dialog */}
      <AlertDialog open={deleteBankDialog} onOpenChange={setDeleteBankDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bank account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBank}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
