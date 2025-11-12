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
  const { currentPage, setCurrentPage, setMarketingTool, setDonorTool, setPersonnelTool, setAccountingTool, setReportTool, setAdministrationTool, selectedEntity, sidebarCollapsed, setSidebarCollapsed, visibilityEditMode, isSidebarItemVisible, toggleSidebarItemVisibility } = useApp();
  
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
        data-sidebar="sidebar"
        className={`fixed top-0 left-0 z-50 h-screen bg-sidebar dark:bg-[#1a1f3a] border-r border-sidebar-border dark:border-[#2d3454] transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'} w-64`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border dark:border-[#2d3454] flex-shrink-0">
            <div className={`flex-1 flex items-center ${sidebarCollapsed ? 'md:justify-center' : 'justify-center md:justify-start'}`}>
              {!sidebarCollapsed && (
                <h2 className="text-gray-700 dark:text-gray-300 leading-tight text-center">{displayName}</h2>
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
                        // Reset report tool when navigating to reports
                        if (item.page === 'reports') {
                          setReportTool(null);
                        }
                        // Reset administration tool when navigating to administration hub
                        if (item.page === 'administration-hub') {
                          setAdministrationTool(null);
                        }
                        
                        // Auto-close sidebar on mobile after navigation
                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }
                    }}
                    disabled={visibilityEditMode}
                    className={`flex-1 flex items-center gap-3 rounded-lg transition-colors ${
                      sidebarCollapsed ? 'md:justify-center md:px-0 px-4' : 'px-4'
                    } py-2.5 ${
                      item.page === currentPage
                        ? 'bg-[#f5f3f0] dark:bg-[#7c8db5]/20 text-gray-900 dark:text-white border-l-4 border-[#6e6b68] dark:border-[#7c8db5] font-medium shadow-[0_1px_3px_rgba(42,40,38,0.1)] dark:shadow-none'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-[#ddd9d4] dark:hover:bg-[#7c8db5]/10 border-l-4 border-transparent'
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
            <div className="p-4 border-t-0 flex-shrink-0">
              <div className="p-3 bg-accent/50 rounded-lg border border-border/50">
                <p className="text-sm font-medium text-foreground">
                  Need help?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
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
