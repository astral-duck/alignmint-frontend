import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider, useApp, DashboardComponent } from './contexts/AppContext';
import { Header } from './components/Header';
import { AppSidebar } from './components/AppSidebar';
import { MetricsCard } from './components/MetricsCard';
import { RevenueChart } from './components/RevenueChart';
import { RecentDonationsTable } from './components/RecentDonationsTable';
import { TopDonorsTable } from './components/TopDonorsTable';
import { TodoList } from './components/TodoList';
import { DonorHub } from './components/DonorHub';
import { DonorsCRM } from './components/DonorsCRM';
import { DonationsManager } from './components/DonationsManager';
import { DonorPageManager } from './components/DonorPageManager';
import { DonorPortal } from './components/DonorPortal';
import { DonorPaymentManagement } from './components/DonorPaymentManagement';
import { PersonnelHub } from './components/PersonnelHub';
import { PersonnelCRM } from './components/PersonnelCRM';
import { VolunteersCRM } from './components/VolunteersCRM';
import { UserManagement } from './components/UserManagement';
import { HourTracking } from './components/HourTracking';
import { MarketingHub } from './components/MarketingHub';
import { MarketingCampaigns } from './components/MarketingCampaigns';
import { VideoBombManager } from './components/VideoBombManager';
import { ProspectsList } from './components/ProspectsList';
import { AccountingHub } from './components/AccountingHub';
import { ReconciliationManager } from './components/ReconciliationManager';
import { ExpensesManager } from './components/ExpensesManager';
import { ReimbursementsManager } from './components/ReimbursementsManager';
import { CheckDepositManager } from './components/CheckDepositManager';
import { RegularDepositManager } from './components/RegularDepositManager';
import { DepositHub } from './components/DepositHub';
import { GeneralLedger } from './components/GeneralLedger';
import { JournalEntryManager } from './components/JournalEntryManager';

import { IncomeStatementByFund } from './components/IncomeStatementByFund';
import { ReportsHub } from './components/ReportsHub';
import { BalanceSheetReport } from './components/BalanceSheetReport';
import { ProfitLossReport } from './components/ProfitLossReport';
import { IncomeStatementReport } from './components/IncomeStatementReport';
import { VolunteerHoursReport } from './components/VolunteerHoursReport';
import { AdministrationHub } from './components/AdministrationHub';
import { DraggableComponent } from './components/DraggableComponent';
import { NonprofitManagement } from './components/NonprofitManagement';
import { ChartOfAccountsManager } from './components/ChartOfAccountsManager';
import { Settings } from './components/Settings';
import { getMetrics } from './lib/mockData';
import { Toaster } from './components/ui/sonner';
import { Calendar, Layout, Check, X } from 'lucide-react';
import { Button } from './components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';

const DashboardContent: React.FC = () => {
  const { 
    selectedEntity, 
    timePeriod, 
    setTimePeriod, 
    currentPage,
    dashboardLayout,
    setDashboardLayout,
    isLayoutEditing,
    setIsLayoutEditing,
    marketingTool,
    setMarketingTool,
    donorTool,
    setDonorTool,
    personnelTool,
    setPersonnelTool,
    accountingTool,
    setAccountingTool,
    reportTool,
    setReportTool,
    administrationTool,
    setAdministrationTool,
    sidebarCollapsed,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const metrics = getMetrics(selectedEntity, timePeriod);

  // Ensure page starts at top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    const newLayout = [...dashboardLayout];
    const [removed] = newLayout.splice(dragIndex, 1);
    newLayout.splice(hoverIndex, 0, removed);
    setDashboardLayout(newLayout);
  }, [dashboardLayout, setDashboardLayout]);

  const renderComponent = (componentId: DashboardComponent) => {
    switch (componentId) {
      case 'donations-chart':
        return <RevenueChart />;
      case 'recent-donations':
        return <RecentDonationsTable />;
      case 'todo-list':
        return <TodoList />;
      case 'top-donors':
        return <TopDonorsTable />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0D0D0D] overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-[#141414]">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' ? (
              <div className="space-y-6">
                {/* Layout Edit Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  {isLayoutEditing ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => setIsLayoutEditing(false)}
                        variant="default"
                        size="sm"
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Done
                      </Button>
                      <Button
                        onClick={() => {
                          setDashboardLayout(['donations-chart', 'recent-donations', 'todo-list']);
                          setIsLayoutEditing(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reset
                      </Button>
                      <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-400 ml-2">
                        Drag components to reorder
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsLayoutEditing(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Layout className="h-4 w-4" />
                      <span className="hidden sm:inline">Change Layout</span>
                      <span className="sm:hidden">Layout</span>
                    </Button>
                  )}
                  
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {metrics.map((metric, index) => (
                    <MetricsCard
                      key={index}
                      label={metric.label}
                      value={metric.value}
                      change={metric.change}
                      trend={metric.trend}
                      icon={metric.icon}
                    />
                  ))}
                </div>

                {/* Draggable Components */}
                <div className="space-y-4 sm:space-y-6">
                  {dashboardLayout.map((componentId, index) => (
                    <DraggableComponent
                      key={componentId}
                      id={componentId}
                      index={index}
                      moveComponent={moveComponent}
                      isEditing={isLayoutEditing}
                    >
                      {renderComponent(componentId)}
                    </DraggableComponent>
                  ))}
                </div>
              </div>
            ) : currentPage === 'donor-hub' ? (
              donorTool === null ? (
                <DonorHub onSelectTool={setDonorTool} />
              ) : donorTool === 'donors' ? (
                <DonorsCRM />
              ) : donorTool === 'donations' ? (
                <DonationsManager />
              ) : donorTool === 'donor-page' ? (
                <DonorPageManager />
              ) : donorTool === 'donor-portal' ? (
                <DonorPortal />
              ) : null
            ) : currentPage === 'personnel-hub' ? (
              personnelTool === null ? (
                <PersonnelHub onSelectTool={setPersonnelTool} />
              ) : personnelTool === 'groups' ? (
                <PersonnelCRM />
              ) : personnelTool === 'volunteers' ? (
                <VolunteersCRM />
              ) : personnelTool === 'hour-tracking' ? (
                <HourTracking />
              ) : null
            ) : currentPage === 'marketing' ? (
              marketingTool === null ? (
                <MarketingHub onSelectTool={setMarketingTool} />
              ) : marketingTool === 'email-blast' ? (
                <MarketingCampaigns />
              ) : marketingTool === 'video-bomb' ? (
                <VideoBombManager />
              ) : marketingTool === 'prospects' ? (
                <ProspectsList />
              ) : null
            ) : currentPage === 'accounting-hub' ? (
              accountingTool === null ? (
                <AccountingHub onSelectTool={setAccountingTool} />
              ) : accountingTool === 'reconciliation' ? (
                <ReconciliationManager />
              ) : accountingTool === 'expenses' ? (
                <ExpensesManager />
              ) : accountingTool === 'reimbursements' ? (
                <ReimbursementsManager />
              ) : accountingTool === 'deposits' ? (
                <DepositHub 
                  onSelectTool={(tool) => setAccountingTool(tool === 'check' ? 'check-deposit' : 'regular-deposit')}
                  onBack={() => setAccountingTool(null)}
                />
              ) : accountingTool === 'check-deposit' ? (
                <CheckDepositManager />
              ) : accountingTool === 'regular-deposit' ? (
                <RegularDepositManager />
              ) : accountingTool === 'general-ledger' ? (
                <GeneralLedger />
              ) : accountingTool === 'income-by-fund' ? (
                <IncomeStatementByFund />
              ) : accountingTool === 'journal-entry' ? (
                <JournalEntryManager />
              ) : null
            ) : currentPage === 'reports' ? (
              reportTool === null ? (
                <ReportsHub onSelectReport={setReportTool} />
              ) : reportTool === 'balance-sheet' ? (
                <BalanceSheetReport />
              ) : reportTool === 'profit-loss' ? (
                <ProfitLossReport />
              ) : reportTool === 'income-statement' ? (
                <IncomeStatementReport />
              ) : reportTool === 'volunteer-hours' ? (
                <VolunteerHoursReport />
              ) : null
            ) : currentPage === 'administration-hub' ? (
              administrationTool === null ? (
                <AdministrationHub onSelectTool={setAdministrationTool} />
              ) : administrationTool === 'users' ? (
                <UserManagement />
              ) : administrationTool === 'donor-management' ? (
                <DonorPaymentManagement />
              ) : administrationTool === 'nonprofit-management' ? (
                <NonprofitManagement />
              ) : administrationTool === 'chart-of-accounts' ? (
                <ChartOfAccountsManager />
              ) : null
            ) : currentPage === 'settings' ? (
              <Settings />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <DashboardContent />
        <Toaster />
      </AppProvider>
    </DndProvider>
  );
}
