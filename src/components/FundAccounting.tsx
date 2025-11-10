import React, { useState, useMemo } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getBankTransactions, getExpenses, getReimbursementRequests, getExpenseById, BankTransaction, Expense, ReimbursementRequest } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DollarSign,
  CheckCircle,
  Clock,
  Upload,
  Send,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Eye,
  Check,
  X,
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';

export const FundAccounting: React.FC = () => {
  const { selectedEntity } = useApp();
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'expenses' | 'reimbursements' | 'distribution'>('reconciliation');
  const [reconcileDialogOpen, setReconcileDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
  const [submitExpenseOpen, setSubmitExpenseOpen] = useState(false);
  const [viewExpenseOpen, setViewExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<ReimbursementRequest | null>(null);

  // Reconciliation form state
  const [reconcileData, setReconcileData] = useState({
    category: '',
    entityId: selectedEntity === 'infocus' ? '' : selectedEntity,
  });

  // Expense submission form state
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    category: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    entityId: selectedEntity === 'infocus' ? '' : selectedEntity,
  });

  const unreconciledTransactions = getBankTransactions(selectedEntity, false);
  const reconciledTransactions = getBankTransactions(selectedEntity, true);
  const allExpenses = getExpenses(selectedEntity);
  const pendingExpenses = getExpenses(selectedEntity, 'pending');
  const approvedExpenses = getExpenses(selectedEntity, 'approved');
  const reimbursedExpenses = getExpenses(selectedEntity, 'reimbursed');
  const allReimbursements = getReimbursementRequests(selectedEntity);
  const pendingReimbursements = getReimbursementRequests(selectedEntity, 'pending');
  const approvedReimbursements = getReimbursementRequests(selectedEntity, 'approved');

  // Calculate totals
  const unreconciledTotal = unreconciledTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingExpensesTotal = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpensesTotal = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingReimbursementsTotal = pendingReimbursements.reduce((sum, r) => sum + r.totalAmount, 0);

  const handleReconcile = () => {
    if (!selectedTransaction) return;

    if (!reconcileData.category || !reconcileData.entityId) {
      toast.error('Please select both category and nonprofit');
      return;
    }

    const entityName = entities.find(e => e.id === reconcileData.entityId)?.name || 'the organization';
    toast.success(`Transaction reconciled to ${entityName} - ${reconcileData.category}`);
    
    setReconcileDialogOpen(false);
    setSelectedTransaction(null);
    setReconcileData({
      category: '',
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
  };

  const handleSubmitExpense = () => {
    if (!expenseData.description || !expenseData.amount || !expenseData.category || !expenseData.vendor || !expenseData.entityId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const entityName = entities.find(e => e.id === expenseData.entityId)?.name || 'the organization';
    toast.success(`Expense submitted for ${entityName} - $${expenseData.amount}`);
    
    setSubmitExpenseOpen(false);
    setExpenseData({
      description: '',
      amount: '',
      category: '',
      vendor: '',
      date: new Date().toISOString().split('T')[0],
      entityId: selectedEntity === 'all' ? '' : selectedEntity,
    });
  };

  const handleApproveExpense = (expense: Expense) => {
    toast.success(`Expense ${expense.id} approved for $${expense.amount.toFixed(2)}`);
  };

  const handleRejectExpense = (expense: Expense) => {
    toast.error(`Expense ${expense.id} rejected`);
  };

  const handleDistributeFunds = (reimbursement: ReimbursementRequest) => {
    const entityName = entities.find(e => e.id === reimbursement.entityId)?.name || 'the organization';
    toast.success(`ACH payment of $${reimbursement.totalAmount.toFixed(2)} initiated to ${entityName}`);
    setDistributeOpen(false);
    setSelectedReimbursement(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'reimbursed':
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1">
            <CheckCircle className="h-3 w-3" />
            Paid
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader 
          title="Accounting"
          subtitle="Manage transactions, expenses, and reimbursements"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unreconciled</p>
                <p className="text-2xl">{unreconciledTransactions.length}</p>
                <p className="text-xs text-gray-500">${Math.abs(unreconciledTotal).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Expenses</p>
                <p className="text-2xl">{pendingExpenses.length}</p>
                <p className="text-xs text-gray-500">${pendingExpensesTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved Expenses</p>
                <p className="text-2xl">{approvedExpenses.length}</p>
                <p className="text-xs text-gray-500">${approvedExpensesTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payouts</p>
                <p className="text-2xl">{pendingReimbursements.length}</p>
                <p className="text-xs text-gray-500">${pendingReimbursementsTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="reconciliation">
            <span className="hidden sm:inline">Reconciliation</span>
            <span className="sm:hidden">Reconcile</span>
          </TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reimbursements">
            <span className="hidden sm:inline">Reimbursements</span>
            <span className="sm:hidden">Reimburse</span>
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <span className="hidden sm:inline">Distribution</span>
            <span className="sm:hidden">Distribute</span>
          </TabsTrigger>
        </TabsList>

        {/* Reconciliation Tab */}
        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>Unreconciled Transactions</CardTitle>
                <Badge variant="outline">
                  {unreconciledTransactions.length} transactions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[200px]">Description</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[150px]">Vendor</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unreconciledTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          All transactions reconciled!
                        </TableCell>
                      </TableRow>
                    ) : (
                      unreconciledTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell className="hidden md:table-cell">{transaction.vendor || '-'}</TableCell>
                          <TableCell>
                            <span className={transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              ${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {transaction.type === 'credit' ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className="capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setReconcileDialogOpen(true);
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                              Reconcile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently Reconciled</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[200px]">Description</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[120px]">Category</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[150px]">Nonprofit</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciledTransactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {entities.find(e => e.id === transaction.entityId)?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <span className={transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={submitExpenseOpen} onOpenChange={setSubmitExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Submit Reimbursement Request</DialogTitle>
                  <DialogDescription>
                    Submit an expense for reimbursement approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-nonprofit">Nonprofit *</Label>
                    <Select
                      value={expenseData.entityId}
                      onValueChange={(value) => setExpenseData({ ...expenseData, entityId: value })}
                    >
                      <SelectTrigger id="expense-nonprofit">
                        <SelectValue placeholder="Select organization..." />
                      </SelectTrigger>
                      <SelectContent>
                        {entities
                          .filter((entity) => entity.id !== 'all')
                          .map((entity) => (
                            <SelectItem key={entity.id} value={entity.id}>
                              {entity.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date *</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={expenseData.date}
                      onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-vendor">Vendor *</Label>
                    <Input
                      id="expense-vendor"
                      placeholder="e.g., Office Depot"
                      value={expenseData.vendor}
                      onChange={(e) => setExpenseData({ ...expenseData, vendor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount *</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseData.amount}
                      onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category *</Label>
                    <Select
                      value={expenseData.category}
                      onValueChange={(value) => setExpenseData({ ...expenseData, category: value })}
                    >
                      <SelectTrigger id="expense-category">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Program Expenses">Program Expenses</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-description">Description *</Label>
                    <Textarea
                      id="expense-description"
                      placeholder="Describe the expense..."
                      value={expenseData.description}
                      onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receipt-upload">Receipt (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                      <input
                        id="receipt-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSubmitExpenseOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitExpense}>Submit for Approval</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[180px]">Description</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[120px]">Vendor</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[150px]">Nonprofit</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No expenses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      allExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell className="hidden md:table-cell">{expense.vendor}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {entities.find(e => e.id === expense.entityId)?.name}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${expense.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{getStatusBadge(expense.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedExpense(expense);
                                  setViewExpenseOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {expense.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleApproveExpense(expense)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleRejectExpense(expense)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
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

        {/* Reimbursements Tab */}
        <TabsContent value="reimbursements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Request ID</TableHead>
                      <TableHead className="min-w-[150px]">Nonprofit</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[120px]">Requested By</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allReimbursements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No reimbursement requests
                        </TableCell>
                      </TableRow>
                    ) : (
                      allReimbursements.map((reimbursement) => (
                        <TableRow key={reimbursement.id}>
                          <TableCell className="font-medium">{reimbursement.id}</TableCell>
                          <TableCell>
                            {entities.find(e => e.id === reimbursement.entityId)?.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{reimbursement.requestedBy}</TableCell>
                          <TableCell className="hidden lg:table-cell">{reimbursement.requestedDate}</TableCell>
                          <TableCell className="font-semibold">
                            ${reimbursement.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedReimbursement(reimbursement);
                                setDistributeOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ready for Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Request ID</TableHead>
                      <TableHead className="min-w-[150px]">Nonprofit</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[100px]">Approved Date</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedReimbursements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No reimbursements ready for distribution
                        </TableCell>
                      </TableRow>
                    ) : (
                      approvedReimbursements.map((reimbursement) => (
                        <TableRow key={reimbursement.id}>
                          <TableCell className="font-medium">{reimbursement.id}</TableCell>
                          <TableCell>
                            {entities.find(e => e.id === reimbursement.entityId)?.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{reimbursement.approvedDate}</TableCell>
                          <TableCell className="font-semibold text-green-600 dark:text-green-400">
                            ${reimbursement.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                setSelectedReimbursement(reimbursement);
                                setDistributeOpen(true);
                              }}
                            >
                              <Send className="h-4 w-4" />
                              Pay via ACH
                            </Button>
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
      </Tabs>

      {/* Reconcile Transaction Dialog */}
      <Dialog open={reconcileDialogOpen} onOpenChange={setReconcileDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reconcile Transaction</DialogTitle>
            <DialogDescription>
              Assign this transaction to a nonprofit and category.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                  <span className="font-medium">{selectedTransaction.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className={`font-semibold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(selectedTransaction.amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reconcile-nonprofit">Nonprofit *</Label>
                <Select
                  value={reconcileData.entityId}
                  onValueChange={(value) => setReconcileData({ ...reconcileData, entityId: value })}
                >
                  <SelectTrigger id="reconcile-nonprofit">
                    <SelectValue placeholder="Select organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {entities
                      .filter((entity) => entity.id !== 'all')
                      .map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reconcile-category">Category *</Label>
                <Select
                  value={reconcileData.category}
                  onValueChange={(value) => setReconcileData({ ...reconcileData, category: value })}
                >
                  <SelectTrigger id="reconcile-category">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Donations">Donations</SelectItem>
                    <SelectItem value="Program Expenses">Program Expenses</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Payroll">Payroll</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReconcileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReconcile}>Reconcile Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Expense Dialog */}
      <Dialog open={viewExpenseOpen} onOpenChange={setViewExpenseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expense ID</p>
                  <p className="font-medium">{selectedExpense.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  {getStatusBadge(selectedExpense.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium">{selectedExpense.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="font-semibold text-lg">${selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nonprofit</p>
                  <p className="font-medium">
                    {entities.find(e => e.id === selectedExpense.entityId)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vendor</p>
                  <p className="font-medium">{selectedExpense.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium">{selectedExpense.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="font-medium">{selectedExpense.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submitted By</p>
                  <p className="font-medium">{selectedExpense.submittedBy} on {selectedExpense.submittedDate}</p>
                </div>
                {selectedExpense.receiptUrl && (
                  <div className="col-span-2">
                    <Button variant="outline" className="gap-2 w-full">
                      <FileText className="h-4 w-4" />
                      View Receipt
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewExpenseOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Distribute Funds Dialog */}
      <Dialog open={distributeOpen} onOpenChange={setDistributeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Distribute Funds via ACH</DialogTitle>
            <DialogDescription>
              Process reimbursement payment to nonprofit organization.
            </DialogDescription>
          </DialogHeader>
          {selectedReimbursement && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recipient:</span>
                  <span className="font-semibold">
                    {entities.find(e => e.id === selectedReimbursement.entityId)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${selectedReimbursement.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Request ID:</span>
                  <span className="font-medium">{selectedReimbursement.id}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select defaultValue="ACH">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACH">ACH Transfer</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> ACH transfer typically takes 1-3 business days to complete.
                  The recipient will be notified via email once the transfer is initiated.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDistributeOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedReimbursement && handleDistributeFunds(selectedReimbursement)}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
