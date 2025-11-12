import React from 'react';
import { Monitor } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface DesktopOnlyWarningProps {
  toolName: string;
  description?: string;
  onBack?: () => void;
}

export const DesktopOnlyWarning: React.FC<DesktopOnlyWarningProps> = ({ 
  toolName, 
  description = 'This accounting tool requires a desktop computer for complex data entry and analysis. Please access this feature from a larger screen.',
  onBack 
}) => {
  return (
    <div className="md:hidden flex items-center justify-center min-h-[50vh] p-6">
      <Card className="max-w-md text-center">
        <CardContent className="p-6 space-y-4">
          <Monitor className="h-16 w-16 mx-auto text-muted-foreground" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Desktop Required</h2>
            <p className="text-sm font-medium text-foreground mb-2">{toolName}</p>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="w-full">
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};