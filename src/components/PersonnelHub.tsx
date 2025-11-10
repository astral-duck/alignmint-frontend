import React from 'react';
import { UsersRound, Heart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { useApp } from '../contexts/AppContext';
import { PageHeader } from './PageHeader';

interface PersonnelHubProps {
  onSelectTool: (tool: 'groups' | 'volunteers' | 'hour-tracking') => void;
}

export const PersonnelHub: React.FC<PersonnelHubProps> = ({ onSelectTool }) => {
  const { visibilityEditMode, isTileVisible, toggleTileVisibility } = useApp();
  const pageId = 'personnel-hub';
  
  const tools = [
    {
      id: 'groups' as const,
      title: 'Groups & Teams',
      description: 'Manage staff, leadership, and organizational teams',
      icon: UsersRound,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      id: 'volunteers' as const,
      title: 'Volunteers',
      description: 'Coordinate and track volunteer activities',
      icon: Heart,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      id: 'hour-tracking' as const,
      title: 'Hour Tracking',
      description: 'Submit and manage volunteer hours',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="People"
        subtitle="Manage your teams and volunteers"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const isVisible = isTileVisible(pageId, tool.id);
          
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
