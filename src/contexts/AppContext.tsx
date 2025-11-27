import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type EntityId = 'all' | 'infocus' | 'awakenings' | 'bloom-strong' | 'bonfire' | 'breakthrough' | 'breathe-pray-worship' | 'child-youth-care' | 'called-to-love-uganda' | 'church-without-walls' | 'corban-family' | 'cornerstone-services' | 'crossroads-youth-ranch' | 'deeper-walk' | 'fidalgo-chaplaincy' | 'fire-rice-ministries' | 'gods-grace-family-ministries' | 'grapevine-ministries' | 'hugs-center' | 'into-the-breach' | 'iron-horse-kids' | 'journeyman-nw' | 'love-with-actions' | 'marriage-mosaic' | 'pure-water' | 'the-uprising' | 'reimagine-ministry' | 'reign-foundation' | 'restored-living' | 'rising-martial-arts' | 'senior-life-champions' | 'skagit-connections' | 'skagit-young-adults' | 'whidbey-resource-chaplain' | 'yellow-soul';
export type TimePeriod = 'day' | 'week' | 'month' | 'ytd';

export interface Entity {
  id: EntityId;
  name: string;
  type: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  entityId: EntityId;
  completed: boolean;
  dueDate?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDueDate: string;
  };
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'financial' | 'operational' | 'alert';
  entityId: EntityId;
  isRead: boolean;
  timestamp: Date;
}

export type PageView = 'dashboard' | 'donor-hub' | 'personnel-hub' | 'marketing' | 'accounting-hub' | 'reports' | 'tools-hub' | 'administration-hub' | 'settings';

export type MarketingTool = 'email-blast' | 'video-bomb' | 'prospects' | null;

export type DonorTool = 'donors' | 'donations' | 'donor-page' | 'donor-portal' | null;

export type PersonnelTool = 'groups' | 'volunteers' | 'hour-tracking' | null;

export type AccountingTool = 'expenses' | 'reimbursements' | 'deposits' | 'check-deposit' | 'regular-deposit' | 'general-ledger' | 'journal-entry' | null;

export type ReportTool = 'balance-sheet' | 'cash-flow' | 'income-statement' | 'volunteer-hours' | 'donor-reporting' | 'comparative' | null;

export type AdministrationTool = 'donor-management' | 'nonprofit-management' | 'chart-of-accounts' | null;

export type ToolsTool = 'reconciliation' | 'sponsor-fee-allocation' | 'memorized-transactions' | null;

export type DashboardComponent = 'donations-chart' | 'recent-donations' | 'todo-list' | 'top-donors';

export interface VideoBomb {
  id: string;
  entityId: EntityId;
  videoUrl: string;
  title: string;
  createdAt: string;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  addedDate: string;
  notes?: string;
}

interface AppContextType {
  selectedEntity: EntityId;
  setSelectedEntity: (id: EntityId) => void;
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  unreadCount: number;
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedDonor: string | null;
  setSelectedDonor: (donorName: string | null) => void;
  dashboardLayout: DashboardComponent[];
  setDashboardLayout: (layout: DashboardComponent[]) => void;
  isLayoutEditing: boolean;
  setIsLayoutEditing: (editing: boolean) => void;
  videoBombs: VideoBomb[];
  addVideoBomb: (videoBomb: Omit<VideoBomb, 'id' | 'createdAt'>) => void;
  deleteVideoBomb: (id: string) => void;
  marketingTool: MarketingTool;
  setMarketingTool: (tool: MarketingTool) => void;
  donorTool: DonorTool;
  setDonorTool: (tool: DonorTool) => void;
  personnelTool: PersonnelTool;
  setPersonnelTool: (tool: PersonnelTool) => void;
  accountingTool: AccountingTool;
  setAccountingTool: (tool: AccountingTool) => void;
  reportTool: ReportTool;
  setReportTool: (tool: ReportTool) => void;
  administrationTool: AdministrationTool;
  setAdministrationTool: (tool: AdministrationTool) => void;
  toolsTool: ToolsTool;
  setToolsTool: (tool: ToolsTool) => void;
  prospects: Prospect[];
  addProspect: (prospect: Omit<Prospect, 'id' | 'addedDate'>) => void;
  deleteProspect: (id: string) => void;
  updateProspect: (id: string, prospect: Partial<Prospect>) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  visibilityEditMode: boolean;
  setVisibilityEditMode: (editing: boolean) => void;
  hiddenSidebarItems: string[];
  toggleSidebarItemVisibility: (itemId: string) => void;
  hiddenTiles: Record<string, string[]>;
  toggleTileVisibility: (pageId: string, tileId: string) => void;
  isSidebarItemVisible: (itemId: string) => boolean;
  isTileVisible: (pageId: string, tileId: string) => boolean;
  // Reconciliation methods
  updateTransactionReconciliation: (transactionId: string, reconciled: boolean, metadata?: {
    reconciled_by?: string;
    reconciliation_method?: 'manual' | 'auto' | 'import';
    bank_statement_ref?: string;
  }) => void;
  bulkUpdateReconciliation: (transactionIds: string[], reconciled: boolean, metadata?: {
    reconciled_by?: string;
    reconciliation_method?: 'manual' | 'auto' | 'import';
    bank_statement_ref?: string;
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const entities: Entity[] = [
  { id: 'all', name: 'All Nonprofits', type: 'all' },
  { id: 'infocus', name: 'InFocus Ministries', type: 'nonprofit' },
  { id: 'awakenings', name: 'Awakenings', type: 'nonprofit' },
  { id: 'bloom-strong', name: 'Bloom Strong', type: 'nonprofit' },
  { id: 'bonfire', name: 'Bonfire', type: 'nonprofit' },
  { id: 'breakthrough', name: 'Breakthrough', type: 'nonprofit' },
  { id: 'breathe-pray-worship', name: 'Breathe Pray Worship', type: 'nonprofit' },
  { id: 'called-to-love-uganda', name: 'Called to Love Uganda', type: 'nonprofit' },
  { id: 'child-youth-care', name: 'Child & Youth Care Organization', type: 'nonprofit' },
  { id: 'church-without-walls', name: 'Church Without Walls', type: 'nonprofit' },
  { id: 'corban-family', name: 'Corban Family', type: 'nonprofit' },
  { id: 'cornerstone-services', name: 'Cornerstone Services', type: 'nonprofit' },
  { id: 'crossroads-youth-ranch', name: 'CrossRoads Youth Ranch', type: 'nonprofit' },
  { id: 'deeper-walk', name: 'Deeper Walk', type: 'nonprofit' },
  { id: 'fidalgo-chaplaincy', name: 'Fidalgo Chaplaincy', type: 'nonprofit' },
  { id: 'fire-rice-ministries', name: 'Fire & Rice Ministries', type: 'nonprofit' },
  { id: 'gods-grace-family-ministries', name: "God's Grace Family Ministries", type: 'nonprofit' },
  { id: 'grapevine-ministries', name: 'Grapevine Ministries', type: 'nonprofit' },
  { id: 'hugs-center', name: 'Hugs Center, Nepal', type: 'nonprofit' },
  { id: 'into-the-breach', name: 'Into the Breach', type: 'nonprofit' },
  { id: 'iron-horse-kids', name: 'Iron Horse Kids FUNd', type: 'nonprofit' },
  { id: 'journeyman-nw', name: 'Journeyman NW', type: 'nonprofit' },
  { id: 'love-with-actions', name: 'Love with Actions', type: 'nonprofit' },
  { id: 'marriage-mosaic', name: 'Marriage Mosaic', type: 'nonprofit' },
  { id: 'pure-water', name: 'Pure Water', type: 'nonprofit' },
  { id: 'reimagine-ministry', name: 'Reimagine Ministry', type: 'nonprofit' },
  { id: 'reign-foundation', name: 'Reign Foundation', type: 'nonprofit' },
  { id: 'restored-living', name: 'Restored Living', type: 'nonprofit' },
  { id: 'rising-martial-arts', name: 'Rising Martial Arts', type: 'nonprofit' },
  { id: 'senior-life-champions', name: 'Senior Life Champions', type: 'nonprofit' },
  { id: 'skagit-connections', name: 'Skagit Connections', type: 'nonprofit' },
  { id: 'skagit-young-adults', name: 'Skagit Young Adults', type: 'nonprofit' },
  { id: 'the-uprising', name: 'The Uprising', type: 'nonprofit' },
  { id: 'whidbey-resource-chaplain', name: 'Whidbey Resource Chaplain (WRC)', type: 'nonprofit' },
  { id: 'yellow-soul', name: 'Yellow Soul', type: 'nonprofit' },
];

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Donation',
    message: 'A new donation of $1,245.00 has been received',
    category: 'financial',
    entityId: 'awakenings',
    isRead: false,
    timestamp: new Date(2025, 9, 10, 9, 30),
  },
  {
    id: '2',
    title: 'Grant Approved',
    message: 'Education grant application has been approved',
    category: 'operational',
    entityId: 'child-youth-care',
    isRead: false,
    timestamp: new Date(2025, 9, 10, 10, 15),
  },
  {
    id: '3',
    title: 'Pending Reimbursements',
    message: '3 reimbursement requests pending review',
    category: 'operational',
    entityId: 'bonfire',
    isRead: false,
    timestamp: new Date(2025, 9, 10, 11, 0),
  },
  {
    id: '4',
    title: 'Low Donations Alert',
    message: 'Donations dropped 5% this week',
    category: 'alert',
    entityId: 'awakenings',
    isRead: false,
    timestamp: new Date(2025, 9, 9, 14, 20),
  },
];

const initialTodos: Todo[] = [
  {
    id: 'TODO-001',
    title: 'Submit Q3 Financial Report',
    description: 'Complete and submit quarterly financial report to fiscal sponsor',
    entityId: 'awakenings',
    completed: false,
    dueDate: '2025-10-15',
    createdAt: '2025-10-01',
  },
  {
    id: 'TODO-002',
    title: 'Process Monthly Reimbursements',
    description: 'Review and approve employee reimbursement requests',
    entityId: 'awakenings',
    completed: false,
    dueDate: '2025-10-12',
    recurring: {
      frequency: 'monthly',
      nextDueDate: '2025-11-12',
    },
    createdAt: '2025-09-12',
  },
  {
    id: 'TODO-003',
    title: 'Update Donor Database',
    description: 'Import new donor contacts from recent fundraising event',
    entityId: 'bonfire',
    completed: true,
    dueDate: '2025-10-08',
    createdAt: '2025-10-01',
  },
  {
    id: 'TODO-004',
    title: 'Prepare Grant Application',
    description: 'Submit grant application for education program funding',
    entityId: 'child-youth-care',
    completed: false,
    dueDate: '2025-10-20',
    createdAt: '2025-10-05',
  },
  {
    id: 'TODO-005',
    title: 'Monthly Board Report',
    description: 'Compile and send monthly report to board members',
    entityId: 'hugs-center',
    completed: false,
    dueDate: '2025-10-18',
    recurring: {
      frequency: 'monthly',
      nextDueDate: '2025-11-18',
    },
    createdAt: '2025-09-18',
  },
  {
    id: 'TODO-006',
    title: 'Reconcile Bank Statements',
    description: 'Review and reconcile all nonprofit bank accounts',
    entityId: 'infocus',
    completed: false,
    dueDate: '2025-10-31',
    recurring: {
      frequency: 'monthly',
      nextDueDate: '2025-11-30',
    },
    createdAt: '2025-09-30',
  },
];

const defaultLayout: DashboardComponent[] = [
  'donations-chart',
  'recent-donations',
  'todo-list',
];

const initialProspects: Prospect[] = [
  {
    id: 'PROS-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    source: 'Website',
    addedDate: '2025-10-15',
    notes: 'Interested in education programs',
  },
  {
    id: 'PROS-002',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 234-5678',
    source: 'Event',
    addedDate: '2025-10-12',
    notes: 'Met at fundraising gala',
  },
  {
    id: 'PROS-003',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    source: 'Referral',
    addedDate: '2025-10-10',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEntity, setSelectedEntity] = useState<EntityId>('infocus');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [dashboardLayout, setDashboardLayout] = useState<DashboardComponent[]>(() => {
    const saved = localStorage.getItem('dashboardLayout');
    return saved ? JSON.parse(saved) : defaultLayout;
  });
  const [isLayoutEditing, setIsLayoutEditing] = useState(false);
  const [videoBombs, setVideoBombs] = useState<VideoBomb[]>([]);
  const [marketingTool, setMarketingTool] = useState<MarketingTool>(null);
  const [donorTool, setDonorTool] = useState<DonorTool>(null);
  const [personnelTool, setPersonnelTool] = useState<PersonnelTool>(null);
  const [accountingTool, setAccountingTool] = useState<AccountingTool>(null);
  const [reportTool, setReportTool] = useState<ReportTool>(null);
  const [administrationTool, setAdministrationTool] = useState<AdministrationTool>(null);
  const [toolsTool, setToolsTool] = useState<ToolsTool>(null);
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Visibility control state
  const [visibilityEditMode, setVisibilityEditMode] = useState(false);
  const [hiddenSidebarItems, setHiddenSidebarItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiddenSidebarItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [hiddenTiles, setHiddenTiles] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('hiddenTiles');
    return saved ? JSON.parse(saved) : {};
  });

  // Save layout to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(dashboardLayout));
  }, [dashboardLayout]);

  // Save visibility settings to localStorage
  useEffect(() => {
    localStorage.setItem('hiddenSidebarItems', JSON.stringify(hiddenSidebarItems));
  }, [hiddenSidebarItems]);

  useEffect(() => {
    localStorage.setItem('hiddenTiles', JSON.stringify(hiddenTiles));
  }, [hiddenTiles]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const filteredNotifications = selectedEntity === 'all'
    ? notifications
    : notifications.filter(n => n.entityId === selectedEntity);

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: `TODO-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          
          // If completing a recurring todo, create a new instance
          if (!todo.completed && todo.recurring) {
            const nextTodo: Todo = {
              ...todo,
              id: `TODO-${Date.now()}-RECUR`,
              completed: false,
              dueDate: todo.recurring.nextDueDate,
              createdAt: new Date().toISOString().split('T')[0],
            };
            
            // Update next due date
            const currentDate = new Date(todo.recurring.nextDueDate);
            let nextDueDate = new Date(currentDate);
            
            switch (todo.recurring.frequency) {
              case 'daily':
                nextDueDate.setDate(currentDate.getDate() + 1);
                break;
              case 'weekly':
                nextDueDate.setDate(currentDate.getDate() + 7);
                break;
              case 'monthly':
                nextDueDate.setMonth(currentDate.getMonth() + 1);
                break;
              case 'yearly':
                nextDueDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            }
            
            nextTodo.recurring!.nextDueDate = nextDueDate.toISOString().split('T')[0];
            
            setTimeout(() => setTodos(prev => [...prev, nextTodo]), 0);
          }
          
          return updatedTodo;
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const addVideoBomb = (videoBomb: Omit<VideoBomb, 'id' | 'createdAt'>) => {
    const newVideoBomb: VideoBomb = {
      ...videoBomb,
      id: `VB-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setVideoBombs(prev => [...prev, newVideoBomb]);
  };

  const deleteVideoBomb = (id: string) => {
    setVideoBombs(prev => prev.filter(vb => vb.id !== id));
  };

  const addProspect = (prospect: Omit<Prospect, 'id' | 'addedDate'>) => {
    const newProspect: Prospect = {
      ...prospect,
      id: `PROS-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0],
    };
    setProspects(prev => [...prev, newProspect]);
  };

  const deleteProspect = (id: string) => {
    setProspects(prev => prev.filter(p => p.id !== id));
  };

  const updateProspect = (id: string, updates: Partial<Prospect>) => {
    setProspects(prev => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  // Visibility control functions
  const toggleSidebarItemVisibility = (itemId: string) => {
    setHiddenSidebarItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const toggleTileVisibility = (pageId: string, tileId: string) => {
    setHiddenTiles(prev => {
      const pageHiddenTiles = prev[pageId] || [];
      if (pageHiddenTiles.includes(tileId)) {
        // Remove from hidden
        const updated = pageHiddenTiles.filter(id => id !== tileId);
        if (updated.length === 0) {
          const { [pageId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [pageId]: updated };
      } else {
        // Add to hidden
        return { ...prev, [pageId]: [...pageHiddenTiles, tileId] };
      }
    });
  };

  const isSidebarItemVisible = (itemId: string) => {
    return !hiddenSidebarItems.includes(itemId);
  };

  const isTileVisible = (pageId: string, tileId: string) => {
    const pageHiddenTiles = hiddenTiles[pageId] || [];
    return !pageHiddenTiles.includes(tileId);
  };

  // Reconciliation methods
  const updateTransactionReconciliation = (
    transactionId: string,
    reconciled: boolean,
    metadata?: {
      reconciled_by?: string;
      reconciliation_method?: 'manual' | 'auto' | 'import';
      bank_statement_ref?: string;
    }
  ) => {
    // Dispatch custom event that GeneralLedger will listen to
    const event = new CustomEvent('reconciliation-update', {
      detail: {
        transactionIds: [transactionId],
        reconciled,
        metadata: {
          ...metadata,
          reconciled_at: new Date().toISOString(),
        },
      },
    });
    window.dispatchEvent(event);
  };

  const bulkUpdateReconciliation = (
    transactionIds: string[],
    reconciled: boolean,
    metadata?: {
      reconciled_by?: string;
      reconciliation_method?: 'manual' | 'auto' | 'import';
      bank_statement_ref?: string;
    }
  ) => {
    // Dispatch custom event that GeneralLedger will listen to
    const event = new CustomEvent('reconciliation-update', {
      detail: {
        transactionIds,
        reconciled,
        metadata: {
          ...metadata,
          reconciled_at: new Date().toISOString(),
        },
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <AppContext.Provider
      value={{
        selectedEntity,
        setSelectedEntity,
        timePeriod,
        setTimePeriod,
        theme,
        toggleTheme,
        notifications: filteredNotifications,
        markNotificationAsRead,
        unreadCount,
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        currentPage,
        setCurrentPage,
        selectedDonor,
        setSelectedDonor,
        dashboardLayout,
        setDashboardLayout,
        isLayoutEditing,
        setIsLayoutEditing,
        videoBombs,
        addVideoBomb,
        deleteVideoBomb,
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
        toolsTool,
        setToolsTool,
        prospects,
        addProspect,
        deleteProspect,
        updateProspect,
        sidebarCollapsed,
        setSidebarCollapsed,
        visibilityEditMode,
        setVisibilityEditMode,
        hiddenSidebarItems,
        toggleSidebarItemVisibility,
        hiddenTiles,
        toggleTileVisibility,
        isSidebarItemVisible,
        isTileVisible,
        updateTransactionReconciliation,
        bulkUpdateReconciliation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
