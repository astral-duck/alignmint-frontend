import React from 'react';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  DollarSign,
  Megaphone,
  Calculator,
  FileText,
  ChevronLeft,
  ChevronRight,
  Mail,
  Heart,
  Calendar,
  Settings,
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useApp, entities } from '../contexts/AppContext';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, setMarketingTool, setDonorTool, setPersonnelTool, setAccountingTool, setAdministrationTool, selectedEntity, sidebarCollapsed, setSidebarCollapsed, visibilityEditMode, isSidebarItemVisible, toggleSidebarItemVisibility } = useApp();
  
  // Get the display name based on selected entity
  const displayName = entities.find(e => e.id === selectedEntity)?.name || 'InFocus Ministries';
  
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as const },
    { name: 'Donor Hub', icon: Users, page: 'donor-hub' as const },
    { name: 'People', icon: UsersRound, page: 'personnel-hub' as const },
    { name: 'Marketing', icon: Mail, page: 'marketing' as const },
    { name: 'Accounting', icon: Calculator, page: 'accounting-hub' as const },
    { name: 'Reports', icon: FileText, page: 'reports' as const },
    { name: 'Administration', icon: Settings, page: 'administration-hub' as const },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-[#2A2A2A] transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'} w-64`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-[#2A2A2A] flex-shrink-0">
            <div className={`flex-1 flex items-center ${sidebarCollapsed ? 'md:justify-center' : 'justify-center md:justify-start'}`}>
              {!sidebarCollapsed && (
                <h2 className="text-blue-600 dark:text-blue-400 leading-tight text-center">{displayName}</h2>
              )}
            </div>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation - scrollable if needed */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isVisible = isSidebarItemVisible(item.page);
              
              // In normal mode, hide items that are marked as hidden
              if (!visibilityEditMode && !isVisible) {
                return null;
              }

              return (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 ${!isVisible && visibilityEditMode ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => {
                      if (!visibilityEditMode && item.page) {
                        setCurrentPage(item.page);
                        // Reset marketing tool when navigating to marketing
                        if (item.page === 'marketing') {
                          setMarketingTool(null);
                        }
                        // Reset donor tool when navigating to donor hub
                        if (item.page === 'donor-hub') {
                          setDonorTool(null);
                        }
                        // Reset personnel tool when navigating to personnel hub
                        if (item.page === 'personnel-hub') {
                          setPersonnelTool(null);
                        }
                        // Reset accounting tool when navigating to accounting hub
                        if (item.page === 'accounting-hub') {
                          setAccountingTool(null);
                        }
                        // Reset administration tool when navigating to administration hub
                        if (item.page === 'administration-hub') {
                          setAdministrationTool(null);
                        }
                      }
                    }}
                    disabled={visibilityEditMode}
                    className={`flex-1 flex items-center gap-3 rounded-lg transition-colors ${
                      sidebarCollapsed ? 'md:justify-center md:px-0 px-4' : 'px-4'
                    } py-2.5 ${
                      item.page === currentPage
                        ? 'bg-blue-50 dark:bg-[#2A2A2A] text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F1F]'
                    } ${visibilityEditMode ? 'cursor-default' : 'cursor-pointer'}`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                  </button>
                  {visibilityEditMode && !sidebarCollapsed && (
                    <Switch
                      checked={isVisible}
                      onCheckedChange={() => toggleSidebarItemVisibility(item.page)}
                      className="flex-shrink-0"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer - always visible */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-[#2A2A2A] flex-shrink-0">
              <div className="p-3 bg-blue-50 dark:bg-[#1F1F1F] rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Need help?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Contact support for assistance
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
