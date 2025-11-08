import React from 'react';
import { Mail, Video, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { useApp } from '../contexts/AppContext';

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
      <div>
        <h1 className="text-gray-900 dark:text-gray-100 mb-1">Marketing</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a marketing tool to get started
        </p>
      </div>

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
