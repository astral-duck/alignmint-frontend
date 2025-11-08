import React from 'react';
import { Users2, Building2, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';

interface AdministrationHubProps {
  onSelectTool: (tool: 'users' | 'donor-management' | 'nonprofit-management' | 'chart-of-accounts') => void;
}

export const AdministrationHub: React.FC<AdministrationHubProps> = ({ onSelectTool }) => {
  const { selectedEntity } = useApp();
  const allTools = [
    {
      id: 'users' as const,
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      requiresInFocus: true, // Only available for InFocus Ministries
    },
    {
      id: 'donor-management' as const,
      title: 'Donor Management',
      description: 'Manage donor records and relationships',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      requiresInFocus: false,
    },
    {
      id: 'nonprofit-management' as const,
      title: 'Nonprofit Management',
      description: 'Add, remove, and control nonprofit visibility',
      icon: Building2,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      requiresInFocus: false,
    },
    {
      id: 'chart-of-accounts' as const,
      title: 'Chart of Accounts',
      description: 'Manage account categories and bank accounts',
      icon: BookOpen,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      requiresInFocus: false,
    },
  ];

  // Filter tools based on selected entity - User Management only for InFocus Ministries
  const tools = allTools.filter(tool => {
    if (tool.requiresInFocus) {
      return selectedEntity === 'infocus-ministries';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-gray-100 mb-1">Administration</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage users and system configuration
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
