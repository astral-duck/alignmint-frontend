import React from 'react';
import { Mail, Video, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { useApp } from '../contexts/AppContext';
import { PageHeader } from './PageHeader';

interface MarketingHubProps {
  onSelectTool: (tool: 'email-blast' | 'video-bomb' | 'prospects') => void;
}

export const MarketingHub: React.FC<MarketingHubProps> = ({ onSelectTool }) => {
  const { visibilityEditMode, isTileVisible, toggleTileVisibility } = useApp();
  const pageId = 'marketing';
  
  const tools = [
    {
      id: 'email-blast' as const,
      title: 'Email Blast',
      description: 'Create and send email campaigns to your donor base',
      icon: Mail,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: 'video-bomb' as const,
      title: 'Video Bomb',
      description: 'Create video donation pages with personalized messages',
      icon: Video,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      id: 'prospects' as const,
      title: 'Prospects',
      description: 'Manage and reach out to potential new donors',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Marketing"
        subtitle="Choose a marketing tool to get started"
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
