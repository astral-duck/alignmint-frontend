import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Globe, Plus, ArrowLeft } from 'lucide-react';
import { DonorPageBuilder, DonorPageConfig } from './DonorPageBuilder';
import { DonorPagePreview } from './DonorPagePreview';

type ViewMode = 'list' | 'builder' | 'preview';

export const DonorPageManager: React.FC = () => {
  const { setDonorTool } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [donorPages, setDonorPages] = useState<DonorPageConfig[]>([]);
  const [previewPage, setPreviewPage] = useState<DonorPageConfig | null>(null);

  const handleSaveDonorPage = (config: DonorPageConfig) => {
    setDonorPages([...donorPages, config]);
    setViewMode('list');
  };

  const handlePreviewDonorPage = (config: DonorPageConfig) => {
    setPreviewPage(config);
    setViewMode('preview');
  };

  const handleBackFromPreview = () => {
    setViewMode('list');
    setPreviewPage(null);
  };

  const handleBackFromBuilder = () => {
    setViewMode('list');
  };

  // Show builder or preview if in those modes
  if (viewMode === 'builder') {
    return (
      <DonorPageBuilder
        onClose={handleBackFromBuilder}
        onSave={handleSaveDonorPage}
        onPreview={handlePreviewDonorPage}
      />
    );
  }

  if (viewMode === 'preview' && previewPage) {
    return <DonorPagePreview config={previewPage} onBack={handleBackFromPreview} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setDonorTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Donor Hub
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-gray-100 mb-1">Donor Pages</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage custom donation pages
          </p>
        </div>
        <Button onClick={() => setViewMode('builder')} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Donor Page</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {donorPages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Globe className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100 mb-2">No donor pages yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  Create beautiful, customized donation pages with pre-templated amounts, copy, photos, recurring donations, and cryptocurrency support.
                </p>
                <Button onClick={() => setViewMode('builder')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Donor Page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Active Donor Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {donorPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-[#2E2E2E]"
                >
                  <div className="flex-1">
                    <p className="font-medium">{page.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{page.entityName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Goal: ${page.goalAmount.toLocaleString()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewPage(page);
                        setViewMode('preview');
                      }}
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      View Page
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
