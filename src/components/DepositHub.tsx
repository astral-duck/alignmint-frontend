import React from 'react';
import { Banknote, DollarSign, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface DepositHubProps {
  onSelectTool: (tool: 'regular' | 'check') => void;
  onBack: () => void;
}

export const DepositHub: React.FC<DepositHubProps> = ({ onSelectTool, onBack }) => {
  const tools = [
    {
      id: 'regular' as const,
      title: 'Regular Deposit',
      description: 'Record income deposits without physical checks',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      id: 'check' as const,
      title: 'Check Deposit',
      description: 'Scan and deposit checks with OCR processing',
      icon: Banknote,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Accounting Hub
      </Button>

      <div>
        <h1 className="text-gray-900 dark:text-gray-100 mb-1">Deposits</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Record deposits into the general ledger
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
            onClick={() => onSelectTool(tool.id)}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}>
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
              </div>
              <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                Open tool →
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
