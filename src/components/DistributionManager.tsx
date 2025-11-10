import React, { useState } from 'react';
import { useApp, entities } from '../contexts/AppContext';
import { getReimbursementRequests, ReimbursementRequest } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  Send,
  CheckCircle,
  Building2,
  ArrowLeft,
} from 'lucide-react';
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
import { toast } from 'sonner@2.0.3';

export const DistributionManager: React.FC = () => {
  const { selectedEntity, setAccountingTool } = useApp();
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<ReimbursementRequest | null>(null);

  const approvedReimbursements = getReimbursementRequests(selectedEntity, 'approved');
  const paidReimbursements = getReimbursementRequests(selectedEntity, 'paid');
  const approvedTotal = approvedReimbursements.reduce((sum, r) => sum + r.totalAmount, 0);

  const handleDistributeFunds = (reimbursement: ReimbursementRequest) => {
    const entityName = entities.find(e => e.id === reimbursement.entityId)?.name || 'the organization';
    toast.success(`ACH payment of $${reimbursement.totalAmount.toFixed(2)} initiated to ${entityName}`);
    setDistributeOpen(false);
    setSelectedReimbursement(null);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 gap-1">
          <CheckCircle className="h-3 w-3" />
          Ready to Pay
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1">
        <CheckCircle className="h-3 w-3" />
        Paid
      </Badge>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setAccountingTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Accounting Hub
      </Button>

      {/* Header */}
      <PageHeader 
        title="Fund Distribution"
        subtitle="Distribute funds to nonprofits via ACH"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payouts</p>
                <p className="text-2xl">{approvedReimbursements.length}</p>
                <p className="text-xs text-gray-500">${approvedTotal.toFixed(2)}</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid This Month</p>
                <p className="text-2xl">{paidReimbursements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ready to Distribute */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Distribute</CardTitle>
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
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedReimbursements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No pending distributions
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedReimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell className="font-mono text-xs">{reimbursement.id}</TableCell>
                      <TableCell className="font-medium">
                        {entities.find(e => e.id === reimbursement.entityId)?.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {reimbursement.requestedBy}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {reimbursement.requestedDate}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${reimbursement.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
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

      {/* Recently Paid */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Paid</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Request ID</TableHead>
                  <TableHead className="min-w-[150px]">Nonprofit</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[100px]">Payment Date</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidReimbursements.slice(0, 5).map((reimbursement) => (
                  <TableRow key={reimbursement.id}>
                    <TableCell className="font-mono text-xs">{reimbursement.id}</TableCell>
                    <TableCell className="font-medium">
                      {entities.find(e => e.id === reimbursement.entityId)?.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {reimbursement.requestedDate}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${reimbursement.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Distribute Confirmation Dialog */}
      <AlertDialog open={distributeOpen} onOpenChange={setDistributeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Distribute Funds via ACH</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReimbursement && (
                <>
                  Initiate ACH payment of{' '}
                  <span className="font-semibold">${selectedReimbursement.totalAmount.toFixed(2)}</span> to{' '}
                  <span className="font-semibold">
                    {entities.find(e => e.id === selectedReimbursement.entityId)?.name}
                  </span>
                  ?
                  <br />
                  <br />
                  This will process the reimbursement request {selectedReimbursement.id} and initiate an electronic
                  funds transfer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedReimbursement(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedReimbursement && handleDistributeFunds(selectedReimbursement)}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              <Send className="h-4 w-4 mr-2" />
              Initiate Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
