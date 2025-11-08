import React from 'react';
import { RefreshCw, Receipt, DollarSign, PieChart, Banknote, BookOpen, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { useApp } from '../contexts/AppContext';

interface AccountingHubProps {
  onSelectTool: (tool: 'reconciliation' | 'expenses' | 'reimbursements' | 'income-by-fund' | 'deposits' | 'general-ledger' | 'journal-entry') => void;
}

export const AccountingHub: React.FC<AccountingHubProps> = ({ onSelectTool }) => {
  const { visibilityEditMode, isTileVisible, toggleTileVisibility } = useApp();
  const pageId = 'accounting-hub';
  
  const tools = [
    {
      id: 'reconciliation' as const,
      title: 'Reconciliation',
      description: 'Match and categorize bank transactions',
      icon: RefreshCw,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      id: 'expenses' as const,
      title: 'Expenses',
      description: 'Submit and approve expense requests',
      icon: Receipt,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      id: 'reimbursements' as const,
      title: 'Reimbursements',
      description: 'Manage reimbursement requests and approvals',
      icon: DollarSign,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'income-by-fund' as const,
      title: 'Sponsor Fee Allocation',
      description: 'Review and confirm monthly admin fees',
      icon: PieChart,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      id: 'deposits' as const,
      title: 'Deposits',
      description: 'Record regular deposits or scan checks',
      icon: Banknote,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      id: 'general-ledger' as const,
      title: 'General Ledger',
      description: 'Complete transaction history with debits and credits',
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      id: 'journal-entry' as const,
      title: 'Journal Entries',
      description: 'Create manual journal entries and adjustments',
      icon: FileText,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-gray-100 mb-1">Accounting</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage transactions, expenses, and fund distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const isVisible = isTileVisible(pageId, tool.id);
          
          // In normal mode, hide tiles that are marked as hidden
          if (!visibilityEditMode && !isVisible) {
            return null;
          }

          return (
            <Card
              key={tool.id}
              className={`${!visibilityEditMode ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow duration-200 group relative ${!isVisible && visibilityEditMode ? 'opacity-50' : ''}`}
              onClick={() => !visibilityEditMode && onSelectTool(tool.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  {visibilityEditMode && (
                    <Switch
                      checked={isVisible}
                      onCheckedChange={() => toggleTileVisibility(pageId, tool.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
                <CardTitle className={`${!visibilityEditMode ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''} transition-colors`}>
                  {tool.title}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              {!visibilityEditMode && (
                <CardContent>
                  <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                    Open tool →
                  </p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
