import { EntityId, TimePeriod } from '../contexts/AppContext';

// Metrics Data
export interface MetricData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

const getPeriodMultiplier = (period: TimePeriod): number => {
  switch (period) {
    case 'day': return 0.03;
    case 'week': return 0.2;
    case 'month': return 1;
    case 'ytd': return 10;
    default: return 1;
  }
};

// Donations Chart Data
export const getDonationsData = (entityId: EntityId, timePeriod: TimePeriod = 'month') => {
  let labels: string[] = [];
  
  switch (timePeriod) {
    case 'day':
      labels = ['12am', '4am', '8am', '12pm', '4pm', '8pm'];
      break;
    case 'week':
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      break;
    case 'month':
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      break;
    case 'ytd':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      break;
  }
  
  const multiplier = getPeriodMultiplier(timePeriod);
  
  const generateData = (baseAmount: number) => labels.map((label, i) => ({
    month: label,
    donations: (baseAmount + Math.random() * (baseAmount * 0.4) + i * (baseAmount * 0.05)) * multiplier,
  }));

  switch (entityId) {
    case 'awakenings': return generateData(3500);
    case 'bloom-strong': return generateData(3000);
    case 'bonfire': return generateData(4800);
    case 'breakthrough': return generateData(2000);
    case 'breathe-pray-worship': return generateData(2400);
    case 'child-youth-care': return generateData(5500);
    case 'hugs-center': return generateData(4100);
    case 'into-the-breach': return generateData(2700);
    case 'iron-horse-kids': return generateData(3300);
    case 'journeyman-nw': return generateData(2100);
    case 'love-with-actions': return generateData(2900);
    case 'marriage-mosaic': return generateData(2600);
    case 'pure-water': return generateData(5100);
    default: return generateData(10000);
  }
};

// Helper to calculate total from chart data
const calculateDonationsTotal = (data: Array<{month: string, donations: number}>): number => {
  return data.reduce((sum, item) => sum + item.donations, 0);
};

export const getMetrics = (entityId: EntityId, timePeriod: TimePeriod = 'month'): MetricData[] => {
  const multiplier = getPeriodMultiplier(timePeriod);
  const formatCurrency = (base: number) => `$${base.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  // Calculate actual total from chart data
  const chartData = getDonationsData(entityId, timePeriod);
  const donationsTotal = calculateDonationsTotal(chartData);
  
  const allMetrics: MetricData[] = [
    { label: 'Total Donations', value: formatCurrency(donationsTotal), change: 12, trend: 'up', icon: 'DollarSign' },
    { label: 'Pending Items', value: '23', change: -5, trend: 'down', icon: 'Clock' },
    { label: 'Recurring Monthly', value: formatCurrency(12450 * multiplier), change: 15, trend: 'up', icon: 'Repeat' },
    { label: 'Total Donors', value: '2,847', change: 8, trend: 'up', icon: 'Users' },
  ];

  const baseMetrics = (pending: number, recurring: number, donors: number): MetricData[] => {
    const chartData = getDonationsData(entityId, timePeriod);
    const donationsTotal = calculateDonationsTotal(chartData);
    return [
      { label: 'Total Donations', value: formatCurrency(donationsTotal), change: 8 + Math.floor(Math.random() * 8), trend: 'up', icon: 'DollarSign' },
      { label: 'Pending Items', value: String(pending), change: Math.floor(Math.random() * 5) - 2, trend: Math.random() > 0.5 ? 'up' : 'down', icon: 'Clock' },
      { label: 'Recurring Monthly', value: formatCurrency(recurring * multiplier), change: 12 + Math.floor(Math.random() * 10), trend: 'up', icon: 'Repeat' },
      { label: 'Total Donors', value: String(donors), change: 5 + Math.floor(Math.random() * 8), trend: 'up', icon: 'Users' },
    ];
  };

  switch (entityId) {
    case 'awakenings': return baseMetrics(3, 1850, 412);
    case 'bloom-strong': return baseMetrics(2, 1200, 325);
    case 'bonfire': return baseMetrics(4, 2400, 587);
    case 'breakthrough': return baseMetrics(1, 980, 215);
    case 'breathe-pray-worship': return baseMetrics(2, 1150, 298);
    case 'child-youth-care': return baseMetrics(5, 3100, 642);
    case 'hugs-center': return baseMetrics(3, 1900, 458);
    case 'into-the-breach': return baseMetrics(2, 1350, 342);
    case 'iron-horse-kids': return baseMetrics(3, 1650, 385);
    case 'journeyman-nw': return baseMetrics(1, 890, 203);
    case 'love-with-actions': return baseMetrics(2, 1480, 356);
    case 'marriage-mosaic': return baseMetrics(2, 1320, 312);
    case 'pure-water': return baseMetrics(4, 2580, 598);
    default: return allMetrics;
  }
};

// Events Chart Data
export const getEventsData = (entityId: EntityId, timePeriod: TimePeriod = 'month') => {
  let labels: string[] = [];
  
  switch (timePeriod) {
    case 'day':
      labels = ['Morning', 'Afternoon', 'Evening'];
      break;
    case 'week':
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      break;
    case 'month':
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      break;
    case 'ytd':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      break;
  }
  
  const baseEvents = timePeriod === 'day' ? 0.5 : timePeriod === 'week' ? 1 : timePeriod === 'month' ? 2 : 8;

  const generateEvents = (multiplier: number) => labels.map(label => ({
    month: label,
    events: Math.max(0, Math.floor(baseEvents * multiplier + Math.random() * baseEvents * multiplier)),
  }));

  switch (entityId) {
    case 'awakenings': return generateEvents(0.4);
    case 'bloom-strong': return generateEvents(0.35);
    case 'bonfire': return generateEvents(0.5);
    case 'breakthrough': return generateEvents(0.25);
    case 'breathe-pray-worship': return generateEvents(0.3);
    case 'child-youth-care': return generateEvents(0.6);
    case 'hugs-center': return generateEvents(0.45);
    case 'into-the-breach': return generateEvents(0.35);
    case 'iron-horse-kids': return generateEvents(0.4);
    case 'journeyman-nw': return generateEvents(0.25);
    case 'love-with-actions': return generateEvents(0.35);
    case 'marriage-mosaic': return generateEvents(0.3);
    case 'pure-water': return generateEvents(0.55);
    default: return generateEvents(1);
  }
};

// Recent Donations Data
export interface Donation {
  id: string;
  donor: string;
  amount: string;
  type: 'one-time' | 'recurring' | 'event';
  date: string;
  purpose?: string;
}

export const getRecentDonations = (entityId: EntityId, timePeriod: TimePeriod = 'month'): Donation[] => {
  const daysBack = timePeriod === 'day' ? 1 : timePeriod === 'week' ? 7 : timePeriod === 'month' ? 30 : 365;
  const today = new Date(2025, 9, 10);
  
  const generateDate = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  const allDonations: Donation[] = [
    { id: 'DN-1001', donor: 'Sarah Johnson', amount: '$500', type: 'recurring', date: generateDate(0), purpose: 'General Fund' },
    { id: 'DN-1002', donor: 'Michael Chen', amount: '$2,500', type: 'one-time', date: generateDate(0), purpose: 'Building Project' },
    { id: 'DN-1003', donor: 'Emily Rodriguez', amount: '$100', type: 'recurring', date: generateDate(1), purpose: 'Youth Programs' },
    { id: 'DN-1004', donor: 'David Thompson', amount: '$1,000', type: 'event', date: generateDate(1), purpose: 'Annual Gala' },
    { id: 'DN-1005', donor: 'Jennifer Lee', amount: '$250', type: 'one-time', date: generateDate(2), purpose: 'Food Pantry' },
    { id: 'DN-1006', donor: 'Robert Martinez', amount: '$5,000', type: 'one-time', date: generateDate(2), purpose: 'Scholarship Fund' },
    { id: 'DN-1007', donor: 'Lisa Anderson', amount: '$150', type: 'recurring', date: generateDate(3), purpose: 'General Fund' },
    { id: 'DN-1008', donor: 'James Wilson', amount: '$750', type: 'one-time', date: generateDate(3), purpose: 'Community Outreach' },
  ].filter(d => {
    const donationDate = new Date(d.date);
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    return donationDate >= cutoffDate;
  });

  // Return all donations for all entities or filter for specific entity
  if (entityId === 'all') return allDonations;
  
  // Return subset for specific entities
  return allDonations.slice(0, 4);
};

// Top Donors Data
export interface TopDonor {
  id: string;
  name: string;
  totalAmount: number;
  donationCount: number;
  lastDonation: string;
  type: 'one-time' | 'recurring';
}

// Donor Profile Data
export interface DonorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  entityId: EntityId;
  totalLifetimeDonations: number;
  donationCount: number;
  firstDonation: string;
  lastDonation: string;
  donationType: 'one-time' | 'recurring' | 'both';
  recurringAmount?: number;
  recurringFrequency?: string;
  tags: string[];
  notes: string;
  donationHistory: Array<{
    date: string;
    amount: number;
    type: 'one-time' | 'recurring' | 'event' | 'refund';
    purpose: string;
    method: string;
  }>;
  engagementScore: number;
  lastContact: string;
}

export const getTopDonors = (entityId: EntityId, donationType: 'one-time' | 'recurring' = 'one-time'): TopDonor[] => {
  const allOneTimeDonors: TopDonor[] = [
    { id: 'D-001', name: 'Robert Martinez', totalAmount: 25000, donationCount: 5, lastDonation: '2025-10-08', type: 'one-time' },
    { id: 'D-002', name: 'Michael Chen', totalAmount: 18500, donationCount: 7, lastDonation: '2025-10-10', type: 'one-time' },
    { id: 'D-003', name: 'Jennifer Lee', totalAmount: 12750, donationCount: 12, lastDonation: '2025-10-08', type: 'one-time' },
    { id: 'D-004', name: 'Amanda White', totalAmount: 9500, donationCount: 6, lastDonation: '2025-10-08', type: 'one-time' },
    { id: 'D-005', name: 'David Thompson', totalAmount: 8200, donationCount: 8, lastDonation: '2025-10-09', type: 'one-time' },
    { id: 'D-006', name: 'Maria Garcia', totalAmount: 7100, donationCount: 4, lastDonation: '2025-10-10', type: 'one-time' },
  ];

  const allRecurringDonors: TopDonor[] = [
    { id: 'D-101', name: 'Sarah Johnson', totalAmount: 6000, donationCount: 12, lastDonation: '2025-10-10', type: 'recurring' },
    { id: 'D-102', name: 'Lisa Anderson', totalAmount: 3600, donationCount: 24, lastDonation: '2025-10-07', type: 'recurring' },
    { id: 'D-103', name: 'Thomas Brown', totalAmount: 2400, donationCount: 12, lastDonation: '2025-10-09', type: 'recurring' },
    { id: 'D-104', name: 'Emily Rodriguez', totalAmount: 1200, donationCount: 12, lastDonation: '2025-10-09', type: 'recurring' },
    { id: 'D-105', name: 'Kevin Davis', totalAmount: 1200, donationCount: 12, lastDonation: '2025-10-07', type: 'recurring' },
    { id: 'D-106', name: 'Patricia Moore', totalAmount: 600, donationCount: 6, lastDonation: '2025-10-05', type: 'recurring' },
  ];
  
  // Return all donors for all view, or a subset for individual nonprofits
  if (entityId === 'all') {
    return donationType === 'one-time' ? allOneTimeDonors : allRecurringDonors;
  }
  
  // For individual nonprofits, return top 3-4 donors
  return donationType === 'one-time' ? allOneTimeDonors.slice(0, 4) : allRecurringDonors.slice(0, 3);
};

// Donor Profiles Data
const allDonorProfiles: DonorProfile[] = [
  // Awakenings Donors
  {
    id: 'DONOR-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Seattle, WA 98101',
    entityId: 'awakenings',
    totalLifetimeDonations: 8185,
    donationCount: 18,
    firstDonation: '2024-01-15',
    lastDonation: '2025-10-10',
    donationType: 'recurring',
    recurringAmount: 500,
    recurringFrequency: 'monthly',
    tags: ['Major Donor', 'Monthly Sustainer', 'Newsletter Subscriber'],
    notes: 'Very engaged donor. Attends all annual events. Interested in youth programs.',
    donationHistory: [
      { date: '2025-10-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-09-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-08-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-07-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-06-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-05-10', amount: 235, type: 'one-time', purpose: 'Called to Love Uganda', method: 'Check' },
      { date: '2025-05-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-04-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-03-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-02-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-01-20', amount: 80, type: 'event', purpose: 'Breath Through Ministry', method: 'Cash' },
      { date: '2025-01-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2024-12-25', amount: 1200, type: 'one-time', purpose: 'Deeper Walk', method: 'Check' },
      { date: '2024-12-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2024-11-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2024-10-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2024-09-15', amount: 170, type: 'event', purpose: 'Deeper Walk', method: 'Cash' },
      { date: '2024-09-10', amount: 500, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
    ],
    engagementScore: 95,
    lastContact: '2025-10-05',
  },
  {
    id: 'DONOR-002',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Portland, OR 97201',
    entityId: 'awakenings',
    totalLifetimeDonations: 18500,
    donationCount: 7,
    firstDonation: '2023-06-20',
    lastDonation: '2025-10-10',
    donationType: 'one-time',
    tags: ['Major Donor', 'Event Attendee', 'Capital Campaign'],
    notes: 'Passionate about building projects. Made significant contribution to new facility.',
    donationHistory: [
      { date: '2025-10-10', amount: 2500, type: 'one-time', purpose: 'Building Project', method: 'Check' },
      { date: '2025-06-15', amount: 5000, type: 'one-time', purpose: 'Building Project', method: 'Bank Transfer' },
      { date: '2024-12-20', amount: 3000, type: 'one-time', purpose: 'Annual Campaign', method: 'Credit Card' },
      { date: '2024-08-10', amount: 2500, type: 'one-time', purpose: 'Emergency Fund', method: 'Check' },
      { date: '2023-12-15', amount: 3500, type: 'one-time', purpose: 'General Fund', method: 'Credit Card' },
    ],
    engagementScore: 88,
    lastContact: '2025-09-28',
  },
  {
    id: 'DONOR-003',
    name: 'David Williams',
    email: 'david.williams@email.com',
    phone: '(555) 345-6789',
    address: '789 Cedar Ln, Seattle, WA 98102',
    entityId: 'awakenings',
    totalLifetimeDonations: 3600,
    donationCount: 18,
    firstDonation: '2023-09-01',
    lastDonation: '2025-10-09',
    donationType: 'recurring',
    recurringAmount: 200,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Long-term Supporter'],
    notes: 'Consistent monthly donor since 2023. Rarely misses a payment.',
    donationHistory: [
      { date: '2025-10-09', amount: 200, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-09-09', amount: 200, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-08-09', amount: 200, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
      { date: '2025-07-09', amount: 200, type: 'recurring', purpose: 'General Fund', method: 'Credit Card' },
    ],
    engagementScore: 90,
    lastContact: '2025-09-20',
  },
  
  // Bloom Strong Donors
  {
    id: 'DONOR-004',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 456-7890',
    address: '321 Birch Ave, Tacoma, WA 98402',
    entityId: 'bloom-strong',
    totalLifetimeDonations: 8400,
    donationCount: 14,
    firstDonation: '2023-05-10',
    lastDonation: '2025-10-08',
    donationType: 'recurring',
    recurringAmount: 600,
    recurringFrequency: 'monthly',
    tags: ['Major Donor', 'Monthly Sustainer', 'Wellness Advocate'],
    notes: 'Passionate about mental health initiatives. Strong community advocate.',
    donationHistory: [
      { date: '2025-10-08', amount: 600, type: 'recurring', purpose: 'Mental Health Programs', method: 'Credit Card' },
      { date: '2025-09-08', amount: 600, type: 'recurring', purpose: 'Mental Health Programs', method: 'Credit Card' },
      { date: '2025-08-08', amount: 600, type: 'recurring', purpose: 'Mental Health Programs', method: 'Credit Card' },
    ],
    engagementScore: 93,
    lastContact: '2025-10-02',
  },
  {
    id: 'DONOR-005',
    name: 'Robert Martinez',
    email: 'robert.martinez@email.com',
    phone: '(555) 567-8901',
    address: '654 Maple Dr, Olympia, WA 98501',
    entityId: 'bloom-strong',
    totalLifetimeDonations: 15000,
    donationCount: 6,
    firstDonation: '2024-02-15',
    lastDonation: '2025-09-25',
    donationType: 'one-time',
    tags: ['Major Donor', 'Event Sponsor'],
    notes: 'Prefers large annual gifts. Sponsors wellness retreat annually.',
    donationHistory: [
      { date: '2025-09-25', amount: 3000, type: 'one-time', purpose: 'Wellness Retreat', method: 'Bank Transfer' },
      { date: '2024-09-20', amount: 3000, type: 'one-time', purpose: 'Wellness Retreat', method: 'Bank Transfer' },
      { date: '2024-06-10', amount: 5000, type: 'one-time', purpose: 'Building Fund', method: 'Check' },
    ],
    engagementScore: 85,
    lastContact: '2025-09-18',
  },

  // Bonfire Donors
  {
    id: 'DONOR-006',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '(555) 678-9012',
    address: '987 Pine St, Bellevue, WA 98004',
    entityId: 'bonfire',
    totalLifetimeDonations: 12000,
    donationCount: 24,
    firstDonation: '2022-11-01',
    lastDonation: '2025-10-10',
    donationType: 'recurring',
    recurringAmount: 500,
    recurringFrequency: 'monthly',
    tags: ['Long-term Sustainer', 'Community Leader', 'Volunteer'],
    notes: 'One of our earliest supporters. Very involved in community events.',
    donationHistory: [
      { date: '2025-10-10', amount: 500, type: 'recurring', cause: 'General Fund', method: 'Credit Card' },
      { date: '2025-09-10', amount: 500, type: 'recurring', cause: 'General Fund', method: 'Credit Card' },
      { date: '2025-08-10', amount: 500, type: 'recurring', cause: 'General Fund', method: 'Credit Card' },
    ],
    engagementScore: 97,
    lastContact: '2025-10-07',
  },
  {
    id: 'DONOR-007',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 789-0123',
    address: '234 Spruce Ct, Seattle, WA 98105',
    entityId: 'bonfire',
    totalLifetimeDonations: 7500,
    donationCount: 10,
    firstDonation: '2023-08-15',
    lastDonation: '2025-10-05',
    donationType: 'one-time',
    tags: ['Major Donor', 'Youth Programs'],
    notes: 'Especially interested in youth mentorship programs.',
    donationHistory: [
      { date: '2025-10-05', amount: 1000, type: 'one-time', cause: 'Youth Mentorship', method: 'Credit Card' },
      { date: '2025-07-12', amount: 1500, type: 'one-time', cause: 'Summer Camp', method: 'Check' },
      { date: '2025-03-20', amount: 2000, type: 'one-time', cause: 'General Fund', method: 'Bank Transfer' },
    ],
    engagementScore: 82,
    lastContact: '2025-09-30',
  },

  // BreakThrough Donors
  {
    id: 'DONOR-008',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '(555) 890-1234',
    address: '567 Ash Dr, Redmond, WA 98052',
    entityId: 'breakthrough',
    totalLifetimeDonations: 4800,
    donationCount: 16,
    firstDonation: '2024-01-20',
    lastDonation: '2025-10-09',
    donationType: 'recurring',
    recurringAmount: 300,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Education Advocate'],
    notes: 'Teacher by profession. Very supportive of educational initiatives.',
    donationHistory: [
      { date: '2025-10-09', amount: 300, type: 'recurring', cause: 'Education Programs', method: 'Credit Card' },
      { date: '2025-09-09', amount: 300, type: 'recurring', cause: 'Education Programs', method: 'Credit Card' },
      { date: '2025-08-09', amount: 300, type: 'recurring', cause: 'Education Programs', method: 'Credit Card' },
    ],
    engagementScore: 88,
    lastContact: '2025-10-01',
  },
  {
    id: 'DONOR-009',
    name: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    phone: '(555) 901-2345',
    address: '890 Willow Way, Kirkland, WA 98033',
    entityId: 'breakthrough',
    totalLifetimeDonations: 9600,
    donationCount: 8,
    firstDonation: '2023-04-10',
    lastDonation: '2025-08-22',
    donationType: 'one-time',
    tags: ['Major Donor', 'Scholarship Fund'],
    notes: 'Funds scholarships for underprivileged students. Very generous supporter.',
    donationHistory: [
      { date: '2025-08-22', amount: 2000, type: 'one-time', cause: 'Scholarship Fund', method: 'Check' },
      { date: '2025-03-15', amount: 1500, type: 'one-time', cause: 'Scholarship Fund', method: 'Bank Transfer' },
      { date: '2024-11-10', amount: 2000, type: 'one-time', cause: 'General Fund', method: 'Check' },
    ],
    engagementScore: 86,
    lastContact: '2025-08-15',
  },

  // Child & Youth Care Organization Donors
  {
    id: 'DONOR-010',
    name: 'Amanda White',
    email: 'amanda.white@email.com',
    phone: '(555) 012-3456',
    address: '123 Poplar Pl, Federal Way, WA 98003',
    entityId: 'child-youth-care',
    totalLifetimeDonations: 21000,
    donationCount: 14,
    firstDonation: '2022-06-01',
    lastDonation: '2025-10-08',
    donationType: 'both',
    recurringAmount: 1000,
    recurringFrequency: 'monthly',
    tags: ['Major Donor', 'Board Member', 'Child Advocate'],
    notes: 'Board member and major supporter. Deeply committed to child welfare.',
    donationHistory: [
      { date: '2025-10-08', amount: 1000, type: 'recurring', cause: 'General Fund', method: 'Bank Transfer' },
      { date: '2025-09-08', amount: 1000, type: 'recurring', cause: 'General Fund', method: 'Bank Transfer' },
      { date: '2025-06-15', amount: 5000, type: 'one-time', cause: 'Emergency Fund', method: 'Check' },
    ],
    engagementScore: 99,
    lastContact: '2025-10-06',
  },
  {
    id: 'DONOR-011',
    name: 'Kevin Davis',
    email: 'kevin.davis@email.com',
    phone: '(555) 123-4567',
    address: '456 Hickory Hill, Auburn, WA 98001',
    entityId: 'child-youth-care',
    totalLifetimeDonations: 5400,
    donationCount: 18,
    firstDonation: '2023-07-15',
    lastDonation: '2025-10-07',
    donationType: 'recurring',
    recurringAmount: 300,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Foster Care Supporter'],
    notes: 'Former foster parent. Passionate about supporting youth in care.',
    donationHistory: [
      { date: '2025-10-07', amount: 300, type: 'recurring', cause: 'Foster Care Program', method: 'Credit Card' },
      { date: '2025-09-07', amount: 300, type: 'recurring', cause: 'Foster Care Program', method: 'Credit Card' },
    ],
    engagementScore: 91,
    lastContact: '2025-09-25',
  },

  // Hugs Center, Nepal Donors
  {
    id: 'DONOR-012',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '(555) 234-5678',
    address: '789 Cypress Ct, Everett, WA 98201',
    entityId: 'hugs-center',
    totalLifetimeDonations: 18000,
    donationCount: 12,
    firstDonation: '2023-01-10',
    lastDonation: '2025-10-10',
    donationType: 'both',
    recurringAmount: 750,
    recurringFrequency: 'monthly',
    tags: ['Major Donor', 'International Programs', 'Monthly Sustainer'],
    notes: 'Visited Nepal in 2023. Very committed to international development.',
    donationHistory: [
      { date: '2025-10-10', amount: 750, type: 'recurring', cause: 'General Fund', method: 'Credit Card' },
      { date: '2025-09-10', amount: 750, type: 'recurring', cause: 'General Fund', method: 'Credit Card' },
      { date: '2025-08-25', amount: 500, type: 'refund', cause: 'Duplicate Charge', method: 'Credit Card' },
      { date: '2025-05-20', amount: 3000, type: 'one-time', cause: 'Building Project', method: 'Bank Transfer' },
    ],
    engagementScore: 94,
    lastContact: '2025-10-04',
  },
  {
    id: 'DONOR-013',
    name: 'Patricia Moore',
    email: 'patricia.moore@email.com',
    phone: '(555) 345-6789',
    address: '321 Fir Forest Rd, Bellingham, WA 98225',
    entityId: 'hugs-center',
    totalLifetimeDonations: 7200,
    donationCount: 24,
    firstDonation: '2022-08-01',
    lastDonation: '2025-10-05',
    donationType: 'recurring',
    recurringAmount: 300,
    recurringFrequency: 'monthly',
    tags: ['Long-term Sustainer', 'Education Focus'],
    notes: 'Supports education initiatives in Nepal. Very reliable donor.',
    donationHistory: [
      { date: '2025-10-05', amount: 300, type: 'recurring', cause: 'Education Fund', method: 'Credit Card' },
      { date: '2025-09-05', amount: 300, type: 'recurring', cause: 'Education Fund', method: 'Credit Card' },
    ],
    engagementScore: 89,
    lastContact: '2025-09-28',
  },

  // Pure Water Donors
  {
    id: 'DONOR-014',
    name: 'Christopher Taylor',
    email: 'christopher.taylor@email.com',
    phone: '(555) 456-7890',
    address: '654 Alder Ave, Spokane, WA 99201',
    entityId: 'pure-water',
    totalLifetimeDonations: 25000,
    donationCount: 10,
    firstDonation: '2023-03-15',
    lastDonation: '2025-09-30',
    donationType: 'one-time',
    tags: ['Major Donor', 'Water Access Advocate', 'Engineer'],
    notes: 'Civil engineer with expertise in water systems. Provides technical advice.',
    donationHistory: [
      { date: '2025-09-30', amount: 5000, type: 'one-time', cause: 'Well Construction', method: 'Bank Transfer' },
      { date: '2025-07-10', amount: 2000, type: 'refund', cause: 'Project Cancelled', method: 'Bank Transfer' },
      { date: '2025-06-15', amount: 5000, type: 'one-time', cause: 'Water Filtration', method: 'Check' },
      { date: '2025-01-20', amount: 5000, type: 'one-time', cause: 'General Fund', method: 'Bank Transfer' },
    ],
    engagementScore: 96,
    lastContact: '2025-09-22',
  },
  {
    id: 'DONOR-015',
    name: 'Nancy Jackson',
    email: 'nancy.jackson@email.com',
    phone: '(555) 567-8901',
    address: '987 Sequoia St, Vancouver, WA 98660',
    entityId: 'pure-water',
    totalLifetimeDonations: 9600,
    donationCount: 16,
    firstDonation: '2023-09-01',
    lastDonation: '2025-10-09',
    donationType: 'recurring',
    recurringAmount: 600,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Global Health Advocate'],
    notes: 'Healthcare professional. Understands importance of clean water access.',
    donationHistory: [
      { date: '2025-10-09', amount: 600, type: 'recurring', cause: 'Water Projects', method: 'Credit Card' },
      { date: '2025-09-09', amount: 600, type: 'recurring', cause: 'Water Projects', method: 'Credit Card' },
    ],
    engagementScore: 92,
    lastContact: '2025-10-03',
  },

  // Child & Youth Care Donors
  {
    id: 'DONOR-016',
    name: 'Patricia Moore',
    email: 'patricia.moore@email.com',
    phone: '(555) 678-9012',
    address: '123 Willow Way, Everett, WA 98201',
    entityId: 'child-youth-care',
    totalLifetimeDonations: 12500,
    donationCount: 25,
    firstDonation: '2022-08-15',
    lastDonation: '2025-10-12',
    donationType: 'recurring',
    recurringAmount: 500,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Child Advocate', 'Former Teacher'],
    notes: 'Retired teacher passionate about youth development. Volunteers regularly.',
    donationHistory: [
      { date: '2025-10-12', amount: 500, type: 'recurring', cause: 'Youth Programs', method: 'Credit Card' },
      { date: '2025-09-12', amount: 500, type: 'recurring', cause: 'Youth Programs', method: 'Credit Card' },
      { date: '2025-08-12', amount: 500, type: 'recurring', cause: 'Youth Programs', method: 'Credit Card' },
      { date: '2025-07-12', amount: 500, type: 'recurring', cause: 'Youth Programs', method: 'Credit Card' },
    ],
    engagementScore: 94,
    lastContact: '2025-10-08',
  },
  {
    id: 'DONOR-017',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 789-0123',
    address: '456 Redwood Rd, Bellingham, WA 98225',
    entityId: 'child-youth-care',
    totalLifetimeDonations: 8000,
    donationCount: 8,
    firstDonation: '2024-01-20',
    lastDonation: '2025-09-28',
    donationType: 'one-time',
    tags: ['Event Donor', 'Parent'],
    notes: 'Parent of youth program participant. Gives during fundraising events.',
    donationHistory: [
      { date: '2025-09-28', amount: 1000, type: 'event', cause: 'Summer Camp Fund', method: 'Credit Card' },
      { date: '2025-06-10', amount: 1000, type: 'event', cause: 'General Fund', method: 'Check' },
      { date: '2025-03-15', amount: 1000, type: 'one-time', cause: 'Equipment Fund', method: 'Credit Card' },
    ],
    engagementScore: 87,
    lastContact: '2025-09-20',
  },

  // Hugs Center Donors
  {
    id: 'DONOR-018',
    name: 'Linda Martinez',
    email: 'linda.martinez@email.com',
    phone: '(555) 890-1234',
    address: '789 Dogwood Dr, Renton, WA 98055',
    entityId: 'hugs-center',
    totalLifetimeDonations: 15000,
    donationCount: 20,
    firstDonation: '2023-02-10',
    lastDonation: '2025-10-14',
    donationType: 'recurring',
    recurringAmount: 750,
    recurringFrequency: 'monthly',
    tags: ['Major Donor', 'Monthly Sustainer', 'Community Leader'],
    notes: 'Business owner who actively promotes the center in the community.',
    donationHistory: [
      { date: '2025-10-14', amount: 750, type: 'recurring', cause: 'General Fund', method: 'Bank Transfer' },
      { date: '2025-09-14', amount: 750, type: 'recurring', cause: 'General Fund', method: 'Bank Transfer' },
      { date: '2025-08-14', amount: 750, type: 'recurring', cause: 'General Fund', method: 'Bank Transfer' },
      { date: '2025-07-14', amount: 750, type: 'recurring', cause: 'General Fund', method: 'Bank Transfer' },
    ],
    engagementScore: 98,
    lastContact: '2025-10-10',
  },

  // Into the Breach Donors
  {
    id: 'DONOR-019',
    name: 'Mark Thompson',
    email: 'mark.thompson@email.com',
    phone: '(555) 901-2345',
    address: '321 Laurel Ln, Spokane Valley, WA 99216',
    entityId: 'into-the-breach',
    totalLifetimeDonations: 6800,
    donationCount: 17,
    firstDonation: '2023-06-01',
    lastDonation: '2025-10-11',
    donationType: 'recurring',
    recurringAmount: 400,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Men\'s Ministry'],
    notes: 'Active participant in men\'s groups. Strong advocate for the ministry.',
    donationHistory: [
      { date: '2025-10-11', amount: 400, type: 'recurring', cause: 'Men\'s Programs', method: 'Credit Card' },
      { date: '2025-09-11', amount: 400, type: 'recurring', cause: 'Men\'s Programs', method: 'Credit Card' },
      { date: '2025-08-11', amount: 400, type: 'recurring', cause: 'Men\'s Programs', method: 'Credit Card' },
    ],
    engagementScore: 91,
    lastContact: '2025-10-05',
  },

  // Iron Horse Kids Donors
  {
    id: 'DONOR-020',
    name: 'Karen Anderson',
    email: 'karen.anderson@email.com',
    phone: '(555) 012-3456',
    address: '654 Hawthorn St, Auburn, WA 98001',
    entityId: 'iron-horse-kids',
    totalLifetimeDonations: 9200,
    donationCount: 23,
    firstDonation: '2023-01-15',
    lastDonation: '2025-10-13',
    donationType: 'recurring',
    recurringAmount: 400,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Grandparent', 'Volunteer'],
    notes: 'Grandparent who volunteers weekly. Very engaged with the kids.',
    donationHistory: [
      { date: '2025-10-13', amount: 400, type: 'recurring', cause: 'Kids Ministry', method: 'Credit Card' },
      { date: '2025-09-13', amount: 400, type: 'recurring', cause: 'Kids Ministry', method: 'Credit Card' },
      { date: '2025-08-13', amount: 400, type: 'recurring', cause: 'Kids Ministry', method: 'Credit Card' },
    ],
    engagementScore: 95,
    lastContact: '2025-10-11',
  },

  // Journeyman NW Donors
  {
    id: 'DONOR-021',
    name: 'Steven Clark',
    email: 'steven.clark@email.com',
    phone: '(555) 123-4567',
    address: '987 Cypress Ct, Lynnwood, WA 98036',
    entityId: 'journeyman-nw',
    totalLifetimeDonations: 5600,
    donationCount: 14,
    firstDonation: '2024-03-20',
    lastDonation: '2025-10-15',
    donationType: 'recurring',
    recurringAmount: 400,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Young Professional'],
    notes: 'Young professional interested in mentorship programs.',
    donationHistory: [
      { date: '2025-10-15', amount: 400, type: 'recurring', cause: 'Mentorship Fund', method: 'Credit Card' },
      { date: '2025-09-15', amount: 400, type: 'recurring', cause: 'Mentorship Fund', method: 'Credit Card' },
      { date: '2025-08-15', amount: 400, type: 'recurring', cause: 'Mentorship Fund', method: 'Credit Card' },
    ],
    engagementScore: 89,
    lastContact: '2025-10-12',
  },

  // Love with Actions Donors
  {
    id: 'DONOR-022',
    name: 'Rebecca Lewis',
    email: 'rebecca.lewis@email.com',
    phone: '(555) 234-5678',
    address: '234 Fir St, Bremerton, WA 98310',
    entityId: 'love-with-actions',
    totalLifetimeDonations: 7500,
    donationCount: 15,
    firstDonation: '2023-07-10',
    lastDonation: '2025-10-09',
    donationType: 'recurring',
    recurringAmount: 500,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Community Service'],
    notes: 'Active volunteer in community outreach programs.',
    donationHistory: [
      { date: '2025-10-09', amount: 500, type: 'recurring', cause: 'Community Outreach', method: 'Credit Card' },
      { date: '2025-09-09', amount: 500, type: 'recurring', cause: 'Community Outreach', method: 'Credit Card' },
      { date: '2025-08-09', amount: 500, type: 'recurring', cause: 'Community Outreach', method: 'Credit Card' },
    ],
    engagementScore: 93,
    lastContact: '2025-10-06',
  },

  // Marriage Mosaic Donors
  {
    id: 'DONOR-023',
    name: 'Daniel and Susan White',
    email: 'thewhites@email.com',
    phone: '(555) 345-6789',
    address: '567 Elm Ave, Kennewick, WA 99336',
    entityId: 'marriage-mosaic',
    totalLifetimeDonations: 4800,
    donationCount: 12,
    firstDonation: '2024-02-14',
    lastDonation: '2025-10-14',
    donationType: 'recurring',
    recurringAmount: 400,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Couple', 'Marriage Enrichment'],
    notes: 'Married couple who have benefited from marriage programs.',
    donationHistory: [
      { date: '2025-10-14', amount: 400, type: 'recurring', cause: 'Marriage Programs', method: 'Credit Card' },
      { date: '2025-09-14', amount: 400, type: 'recurring', cause: 'Marriage Programs', method: 'Credit Card' },
      { date: '2025-08-14', amount: 400, type: 'recurring', cause: 'Marriage Programs', method: 'Credit Card' },
    ],
    engagementScore: 88,
    lastContact: '2025-10-08',
  },

  // Breakthrough Donors
  {
    id: 'DONOR-024',
    name: 'Angela Davis',
    email: 'angela.davis@email.com',
    phone: '(555) 456-7890',
    address: '890 Spruce Pl, Yakima, WA 98901',
    entityId: 'breakthrough',
    totalLifetimeDonations: 3200,
    donationCount: 8,
    firstDonation: '2024-06-01',
    lastDonation: '2025-09-30',
    donationType: 'recurring',
    recurringAmount: 400,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Recovery Support'],
    notes: 'Supporter of recovery and breakthrough programs.',
    donationHistory: [
      { date: '2025-09-30', amount: 400, type: 'recurring', cause: 'Recovery Programs', method: 'Credit Card' },
      { date: '2025-08-30', amount: 400, type: 'recurring', cause: 'Recovery Programs', method: 'Credit Card' },
      { date: '2025-07-30', amount: 400, type: 'recurring', cause: 'Recovery Programs', method: 'Credit Card' },
    ],
    engagementScore: 86,
    lastContact: '2025-09-25',
  },

  // Breathe, Pray, Worship Donors
  {
    id: 'DONOR-025',
    name: 'Michelle Roberts',
    email: 'michelle.roberts@email.com',
    phone: '(555) 567-8901',
    address: '123 Cherry Blossom Ln, Wenatchee, WA 98801',
    entityId: 'breathe-pray-worship',
    totalLifetimeDonations: 5400,
    donationCount: 18,
    firstDonation: '2023-04-05',
    lastDonation: '2025-10-10',
    donationType: 'recurring',
    recurringAmount: 300,
    recurringFrequency: 'monthly',
    tags: ['Monthly Sustainer', 'Worship Leader', 'Prayer Ministry'],
    notes: 'Active in worship and prayer ministries. Very spiritual.',
    donationHistory: [
      { date: '2025-10-10', amount: 300, type: 'recurring', cause: 'Worship Ministry', method: 'Credit Card' },
      { date: '2025-09-10', amount: 300, type: 'recurring', cause: 'Worship Ministry', method: 'Credit Card' },
      { date: '2025-08-10', amount: 300, type: 'recurring', cause: 'Worship Ministry', method: 'Credit Card' },
    ],
    engagementScore: 92,
    lastContact: '2025-10-07',
  },
];

export const getDonorProfile = (donorName: string, entityId: EntityId): DonorProfile | null => {
  // Find donor by name
  const donor = allDonorProfiles.find(d => d.name === donorName);
  if (!donor) return null;
  
  // Check if donor belongs to selected entity
  if (entityId !== 'all' && donor.entityId !== entityId) {
    return null;
  }
  
  return donor;
};

export const getAllDonors = (entityId: EntityId): DonorProfile[] => {
  if (entityId === 'all') {
    return allDonorProfiles;
  }
  
  // Filter donors by specific entity
  return allDonorProfiles.filter(donor => donor.entityId === entityId);
};

// Personnel/Team Members Data
export interface PersonnelProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  entityId: EntityId;
  hireDate: string;
  employmentType: 'full-time' | 'part-time' | 'contractor' | 'volunteer';
  status: 'active' | 'on-leave' | 'inactive';
  salary?: number;
  taxInfo: {
    ssn?: string; // Last 4 digits only
    taxId?: string;
    w4Status?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes: string;
  avatar?: string;
}

const allPersonnel: PersonnelProfile[] = [
  // Awakenings Personnel
  {
    id: 'PERS-001',
    name: 'John Anderson',
    role: 'Executive Director',
    department: 'Leadership',
    email: 'john.anderson@awakenings.org',
    phone: '(555) 100-0001',
    address: '1234 Leadership Way, Seattle, WA 98101',
    entityId: 'awakenings',
    hireDate: '2020-03-15',
    employmentType: 'full-time',
    status: 'active',
    salary: 85000,
    taxInfo: {
      ssn: '****-1234',
      w4Status: 'Married',
    },
    emergencyContact: {
      name: 'Sarah Anderson',
      relationship: 'Spouse',
      phone: '(555) 100-0002',
    },
    notes: 'Founded Awakenings program. Strong community leader.',
  },
  {
    id: 'PERS-002',
    name: 'Maria Santos',
    role: 'Program Coordinator',
    department: 'Operations',
    email: 'maria.santos@awakenings.org',
    phone: '(555) 100-0003',
    address: '5678 Program St, Seattle, WA 98102',
    entityId: 'awakenings',
    hireDate: '2021-06-01',
    employmentType: 'full-time',
    status: 'active',
    salary: 58000,
    taxInfo: {
      ssn: '****-5678',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Carlos Santos',
      relationship: 'Brother',
      phone: '(555) 100-0004',
    },
    notes: 'Excellent organizational skills. Manages day-to-day operations.',
  },
  {
    id: 'PERS-003',
    name: 'David Kim',
    role: 'Volunteer Coordinator',
    department: 'Community Engagement',
    email: 'david.kim@awakenings.org',
    phone: '(555) 100-0005',
    address: '9012 Volunteer Ave, Seattle, WA 98103',
    entityId: 'awakenings',
    hireDate: '2022-01-10',
    employmentType: 'part-time',
    status: 'active',
    salary: 35000,
    taxInfo: {
      ssn: '****-9012',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Jennifer Kim',
      relationship: 'Mother',
      phone: '(555) 100-0006',
    },
    notes: 'Manages volunteer programs and community outreach.',
  },

  // Bloom Strong Personnel
  {
    id: 'PERS-004',
    name: 'Rachel Thompson',
    role: 'Mental Health Director',
    department: 'Clinical Services',
    email: 'rachel.thompson@bloomstrong.org',
    phone: '(555) 200-0001',
    address: '2345 Wellness Blvd, Tacoma, WA 98402',
    entityId: 'bloom-strong',
    hireDate: '2019-08-20',
    employmentType: 'full-time',
    status: 'active',
    salary: 92000,
    taxInfo: {
      ssn: '****-3456',
      w4Status: 'Head of Household',
    },
    emergencyContact: {
      name: 'Mark Thompson',
      relationship: 'Husband',
      phone: '(555) 200-0002',
    },
    notes: 'Licensed therapist with 10+ years experience.',
  },
  {
    id: 'PERS-005',
    name: 'Alex Rivera',
    role: 'Wellness Coach',
    department: 'Programs',
    email: 'alex.rivera@bloomstrong.org',
    phone: '(555) 200-0003',
    address: '6789 Health Way, Tacoma, WA 98403',
    entityId: 'bloom-strong',
    hireDate: '2021-03-15',
    employmentType: 'full-time',
    status: 'active',
    salary: 52000,
    taxInfo: {
      ssn: '****-7890',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Sofia Rivera',
      relationship: 'Sister',
      phone: '(555) 200-0004',
    },
    notes: 'Certified wellness coach specializing in holistic health.',
  },

  // Bonfire Personnel
  {
    id: 'PERS-006',
    name: 'Michael Chen',
    role: 'Youth Programs Director',
    department: 'Youth Services',
    email: 'michael.chen@bonfire.org',
    phone: '(555) 300-0001',
    address: '3456 Youth Center Rd, Bellevue, WA 98004',
    entityId: 'bonfire',
    hireDate: '2018-05-01',
    employmentType: 'full-time',
    status: 'active',
    salary: 78000,
    taxInfo: {
      ssn: '****-2468',
      w4Status: 'Married',
    },
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Wife',
      phone: '(555) 300-0002',
    },
    notes: 'Developed award-winning youth mentorship program.',
  },
  {
    id: 'PERS-007',
    name: 'Jessica Martinez',
    role: 'Activities Coordinator',
    department: 'Programs',
    email: 'jessica.martinez@bonfire.org',
    phone: '(555) 300-0003',
    address: '7890 Activity Lane, Bellevue, WA 98005',
    entityId: 'bonfire',
    hireDate: '2020-09-12',
    employmentType: 'part-time',
    status: 'active',
    salary: 38000,
    taxInfo: {
      ssn: '****-1357',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Roberto Martinez',
      relationship: 'Father',
      phone: '(555) 300-0004',
    },
    notes: 'Organizes after-school programs and summer camps.',
  },

  // BreakThrough Personnel
  {
    id: 'PERS-008',
    name: 'Sarah Williams',
    role: 'Education Director',
    department: 'Academic Services',
    email: 'sarah.williams@breakthrough.org',
    phone: '(555) 400-0001',
    address: '4567 Learning St, Redmond, WA 98052',
    entityId: 'breakthrough',
    hireDate: '2019-01-15',
    employmentType: 'full-time',
    status: 'active',
    salary: 72000,
    taxInfo: {
      ssn: '****-8642',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Robert Williams',
      relationship: 'Brother',
      phone: '(555) 400-0002',
    },
    notes: 'Former public school teacher, specializes in STEM education.',
  },
  {
    id: 'PERS-009',
    name: 'James Foster',
    role: 'Tutor',
    department: 'Academic Support',
    email: 'james.foster@breakthrough.org',
    phone: '(555) 400-0003',
    address: '8901 Tutor Ave, Redmond, WA 98053',
    entityId: 'breakthrough',
    hireDate: '2022-08-20',
    employmentType: 'part-time',
    status: 'active',
    salary: 28000,
    taxInfo: {
      ssn: '****-9753',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Emily Foster',
      relationship: 'Mother',
      phone: '(555) 400-0004',
    },
    notes: 'Graduate student working part-time. Math and science specialist.',
  },

  // Child & Youth Care Organization Personnel
  {
    id: 'PERS-010',
    name: 'Patricia Johnson',
    role: 'Executive Director',
    department: 'Leadership',
    email: 'patricia.johnson@childyouthcare.org',
    phone: '(555) 500-0001',
    address: '5678 Care Center Dr, Federal Way, WA 98003',
    entityId: 'child-youth-care',
    hireDate: '2017-02-10',
    employmentType: 'full-time',
    status: 'active',
    salary: 95000,
    taxInfo: {
      ssn: '****-1593',
      w4Status: 'Married',
    },
    emergencyContact: {
      name: 'Thomas Johnson',
      relationship: 'Husband',
      phone: '(555) 500-0002',
    },
    notes: '15+ years in child welfare services. Licensed social worker.',
  },
  {
    id: 'PERS-011',
    name: 'Kevin Wright',
    role: 'Case Manager',
    department: 'Social Services',
    email: 'kevin.wright@childyouthcare.org',
    phone: '(555) 500-0003',
    address: '9012 Support St, Auburn, WA 98001',
    entityId: 'child-youth-care',
    hireDate: '2020-11-05',
    employmentType: 'full-time',
    status: 'active',
    salary: 62000,
    taxInfo: {
      ssn: '****-7531',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Mary Wright',
      relationship: 'Sister',
      phone: '(555) 500-0004',
    },
    notes: 'Manages caseload of 20+ families. Bilingual (English/Spanish).',
  },

  // Hugs Center, Nepal Personnel
  {
    id: 'PERS-012',
    name: 'Rajesh Sharma',
    role: 'Country Director',
    department: 'International Operations',
    email: 'rajesh.sharma@hugscenter.org',
    phone: '+977-1-234-5678',
    address: 'Kathmandu Valley, Nepal',
    entityId: 'hugs-center',
    hireDate: '2018-06-15',
    employmentType: 'full-time',
    status: 'active',
    salary: 45000,
    taxInfo: {
      taxId: 'NPL-12345',
    },
    emergencyContact: {
      name: 'Priya Sharma',
      relationship: 'Wife',
      phone: '+977-1-234-5679',
    },
    notes: 'Local leader with deep community connections.',
  },
  {
    id: 'PERS-013',
    name: 'Maya Gurung',
    role: 'Education Coordinator',
    department: 'Programs',
    email: 'maya.gurung@hugscenter.org',
    phone: '+977-1-345-6789',
    address: 'Pokhara, Nepal',
    entityId: 'hugs-center',
    hireDate: '2020-03-01',
    employmentType: 'full-time',
    status: 'active',
    salary: 32000,
    taxInfo: {
      taxId: 'NPL-67890',
    },
    emergencyContact: {
      name: 'Binod Gurung',
      relationship: 'Brother',
      phone: '+977-1-345-6780',
    },
    notes: 'Manages educational programs for 100+ children.',
  },

  // Pure Water Personnel
  {
    id: 'PERS-014',
    name: 'Daniel Cooper',
    role: 'Water Systems Engineer',
    department: 'Engineering',
    email: 'daniel.cooper@purewater.org',
    phone: '(555) 600-0001',
    address: '6789 Engineering Way, Spokane, WA 99201',
    entityId: 'pure-water',
    hireDate: '2019-04-20',
    employmentType: 'full-time',
    status: 'active',
    salary: 88000,
    taxInfo: {
      ssn: '****-4826',
      w4Status: 'Married',
    },
    emergencyContact: {
      name: 'Amanda Cooper',
      relationship: 'Wife',
      phone: '(555) 600-0002',
    },
    notes: 'PE license. Specializes in rural water infrastructure.',
  },
  {
    id: 'PERS-015',
    name: 'Linda Martinez',
    role: 'Field Coordinator',
    department: 'Operations',
    email: 'linda.martinez@purewater.org',
    phone: '(555) 600-0003',
    address: '7890 Field Office Rd, Vancouver, WA 98660',
    entityId: 'pure-water',
    hireDate: '2021-07-10',
    employmentType: 'full-time',
    status: 'active',
    salary: 56000,
    taxInfo: {
      ssn: '****-9517',
      w4Status: 'Single',
    },
    emergencyContact: {
      name: 'Carlos Martinez',
      relationship: 'Father',
      phone: '(555) 600-0004',
    },
    notes: 'Manages international project deployments.',
  },
];

export const getPersonnelProfile = (personnelName: string, entityId: EntityId): PersonnelProfile | null => {
  const person = allPersonnel.find(p => p.name === personnelName);
  if (!person) return null;
  
  // Check if personnel belongs to selected entity
  if (entityId !== 'all' && person.entityId !== entityId) {
    return null;
  }
  
  return person;
};

export const getAllPersonnel = (entityId: EntityId): PersonnelProfile[] => {
  if (entityId === 'all') {
    return allPersonnel;
  }
  
  // Filter personnel by specific entity
  return allPersonnel.filter(person => person.entityId === entityId);
};

export const getPersonnelByEntity = (): Map<EntityId, PersonnelProfile[]> => {
  const grouped = new Map<EntityId, PersonnelProfile[]>();
  
  allPersonnel.forEach(person => {
    if (!grouped.has(person.entityId)) {
      grouped.set(person.entityId, []);
    }
    grouped.get(person.entityId)!.push(person);
  });
  
  return grouped;
};

// Donation Management Data
export interface DonationRecord {
  id: string;
  donorName: string | null; // null if unassigned
  amount: number;
  date: string;
  type: 'one-time' | 'recurring' | 'event';
  method: 'credit-card' | 'bank-transfer' | 'check' | 'cash' | 'paypal' | 'other';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  cause: string;
  campaign?: string;
  notes?: string;
  receiptSent: boolean;
  entityId: EntityId;
  taxDeductible: boolean;
}

const allDonationRecords: DonationRecord[] = [
  // Awakenings Donations
  {
    id: 'DON-001',
    donorName: 'Sarah Johnson',
    amount: 500,
    date: '2025-10-10',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: true,
    entityId: 'awakenings',
    taxDeductible: true,
    notes: 'Monthly recurring donation',
  },
  {
    id: 'DON-002',
    donorName: 'Michael Chen',
    amount: 2500,
    date: '2025-10-10',
    type: 'one-time',
    method: 'check',
    status: 'completed',
    cause: 'Building Project',
    campaign: 'New Facility Fund',
    receiptSent: true,
    entityId: 'awakenings',
    taxDeductible: true,
  },
  {
    id: 'DON-003',
    donorName: 'David Williams',
    amount: 200,
    date: '2025-10-09',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: true,
    entityId: 'awakenings',
    taxDeductible: true,
  },
  {
    id: 'DON-004',
    donorName: null, // Unassigned
    amount: 150,
    date: '2025-10-08',
    type: 'one-time',
    method: 'cash',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: false,
    entityId: 'awakenings',
    taxDeductible: true,
    notes: 'Anonymous cash donation - needs assignment',
  },
  {
    id: 'DON-005',
    donorName: 'Sarah Johnson',
    amount: 500,
    date: '2025-09-10',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: true,
    entityId: 'awakenings',
    taxDeductible: true,
  },

  // Bloom Strong Donations
  {
    id: 'DON-006',
    donorName: 'Emily Rodriguez',
    amount: 600,
    date: '2025-10-08',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'Mental Health Programs',
    receiptSent: true,
    entityId: 'bloom-strong',
    taxDeductible: true,
  },
  {
    id: 'DON-007',
    donorName: 'Robert Martinez',
    amount: 3000,
    date: '2025-09-25',
    type: 'one-time',
    method: 'bank-transfer',
    status: 'completed',
    cause: 'Wellness Retreat',
    campaign: 'Annual Wellness Retreat 2025',
    receiptSent: true,
    entityId: 'bloom-strong',
    taxDeductible: true,
  },
  {
    id: 'DON-008',
    donorName: null,
    amount: 250,
    date: '2025-10-05',
    type: 'one-time',
    method: 'paypal',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: false,
    entityId: 'bloom-strong',
    taxDeductible: true,
    notes: 'PayPal donation - awaiting donor information',
  },

  // Bonfire Donations
  {
    id: 'DON-009',
    donorName: 'Jennifer Lee',
    amount: 500,
    date: '2025-10-10',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: true,
    entityId: 'bonfire',
    taxDeductible: true,
  },
  {
    id: 'DON-010',
    donorName: 'James Wilson',
    amount: 1000,
    date: '2025-10-05',
    type: 'one-time',
    method: 'credit-card',
    status: 'completed',
    cause: 'Youth Mentorship',
    receiptSent: true,
    entityId: 'bonfire',
    taxDeductible: true,
  },
  {
    id: 'DON-011',
    donorName: 'James Wilson',
    amount: 1500,
    date: '2025-07-12',
    type: 'one-time',
    method: 'check',
    status: 'completed',
    cause: 'Summer Camp',
    campaign: 'Summer Camp Scholarship Fund',
    receiptSent: true,
    entityId: 'bonfire',
    taxDeductible: true,
  },

  // BreakThrough Donations
  {
    id: 'DON-012',
    donorName: 'Lisa Anderson',
    amount: 300,
    date: '2025-10-09',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'Education Programs',
    receiptSent: true,
    entityId: 'breakthrough',
    taxDeductible: true,
  },
  {
    id: 'DON-013',
    donorName: 'Thomas Brown',
    amount: 2000,
    date: '2025-08-22',
    type: 'one-time',
    method: 'check',
    status: 'completed',
    cause: 'Scholarship Fund',
    receiptSent: true,
    entityId: 'breakthrough',
    taxDeductible: true,
  },
  {
    id: 'DON-014',
    donorName: null,
    amount: 500,
    date: '2025-10-07',
    type: 'one-time',
    method: 'other',
    status: 'pending',
    cause: 'Scholarship Fund',
    receiptSent: false,
    entityId: 'breakthrough',
    taxDeductible: true,
    notes: 'Corporate matching gift - pending verification',
  },

  // Child & Youth Care Donations
  {
    id: 'DON-015',
    donorName: 'Amanda White',
    amount: 1000,
    date: '2025-10-08',
    type: 'recurring',
    method: 'bank-transfer',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: true,
    entityId: 'child-youth-care',
    taxDeductible: true,
  },
  {
    id: 'DON-016',
    donorName: 'Kevin Davis',
    amount: 300,
    date: '2025-10-07',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'Foster Care Program',
    receiptSent: true,
    entityId: 'child-youth-care',
    taxDeductible: true,
  },
  {
    id: 'DON-017',
    donorName: 'Amanda White',
    amount: 5000,
    date: '2025-06-15',
    type: 'one-time',
    method: 'check',
    status: 'completed',
    cause: 'Emergency Fund',
    campaign: 'Emergency Family Support',
    receiptSent: true,
    entityId: 'child-youth-care',
    taxDeductible: true,
  },

  // Hugs Center, Nepal Donations
  {
    id: 'DON-018',
    donorName: 'Maria Garcia',
    amount: 750,
    date: '2025-10-10',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: true,
    entityId: 'hugs-center',
    taxDeductible: true,
  },
  {
    id: 'DON-019',
    donorName: 'Patricia Moore',
    amount: 300,
    date: '2025-10-05',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'Education Fund',
    receiptSent: true,
    entityId: 'hugs-center',
    taxDeductible: true,
  },
  {
    id: 'DON-020',
    donorName: 'Maria Garcia',
    amount: 3000,
    date: '2025-05-20',
    type: 'one-time',
    method: 'bank-transfer',
    status: 'completed',
    cause: 'Building Project',
    campaign: 'New School Building',
    receiptSent: true,
    entityId: 'hugs-center',
    taxDeductible: true,
  },

  // Pure Water Donations
  {
    id: 'DON-021',
    donorName: 'Christopher Taylor',
    amount: 5000,
    date: '2025-09-30',
    type: 'one-time',
    method: 'bank-transfer',
    status: 'completed',
    cause: 'Well Construction',
    receiptSent: true,
    entityId: 'pure-water',
    taxDeductible: true,
  },
  {
    id: 'DON-022',
    donorName: 'Nancy Jackson',
    amount: 600,
    date: '2025-10-09',
    type: 'recurring',
    method: 'credit-card',
    status: 'completed',
    cause: 'Water Projects',
    receiptSent: true,
    entityId: 'pure-water',
    taxDeductible: true,
  },
  {
    id: 'DON-023',
    donorName: 'Christopher Taylor',
    amount: 5000,
    date: '2025-06-15',
    type: 'one-time',
    method: 'check',
    status: 'completed',
    cause: 'Water Filtration',
    campaign: 'Clean Water Initiative',
    receiptSent: true,
    entityId: 'pure-water',
    taxDeductible: true,
  },
  {
    id: 'DON-024',
    donorName: null,
    amount: 1000,
    date: '2025-10-06',
    type: 'one-time',
    method: 'other',
    status: 'completed',
    cause: 'General Fund',
    receiptSent: false,
    entityId: 'pure-water',
    taxDeductible: true,
    notes: 'Donor-advised fund transfer - identifying donor',
  },
];

export const getAllDonationRecords = (entityId: EntityId): DonationRecord[] => {
  if (entityId === 'all') {
    return allDonationRecords;
  }
  
  return allDonationRecords.filter(donation => donation.entityId === entityId);
};

export const getDonationRecord = (donationId: string): DonationRecord | null => {
  return allDonationRecords.find(d => d.id === donationId) || null;
};

// Volunteer Data
export interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  entityId: EntityId;
  totalHours: number;
  sessionCount: number;
  firstVolunteered: string;
  lastVolunteered: string;
  volunteerType: 'regular' | 'occasional' | 'event-based';
  skills: string[];
  availability: string[];
  interests: string[];
  volunteerHistory: Array<{
    date: string;
    hours: number;
    activity: string;
    notes?: string;
  }>;
  engagementScore: number;
  backgroundCheckStatus: 'pending' | 'approved' | 'expired' | 'not-required';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes: string;
}

const allVolunteerProfiles: VolunteerProfile[] = [
  // Awakenings Volunteers
  {
    id: 'VOL-001',
    name: 'Rebecca Turner',
    email: 'rebecca.turner@email.com',
    phone: '(555) 700-0001',
    address: '1234 Service Lane, Seattle, WA 98101',
    entityId: 'awakenings',
    totalHours: 245,
    sessionCount: 32,
    firstVolunteered: '2024-02-15',
    lastVolunteered: '2025-10-08',
    volunteerType: 'regular',
    skills: ['Event Planning', 'Social Media', 'Fundraising'],
    availability: ['Weekends', 'Evenings'],
    interests: ['Community Outreach', 'Event Coordination'],
    volunteerHistory: [
      { date: '2025-10-08', hours: 4, activity: 'Community Event Setup' },
      { date: '2025-10-01', hours: 6, activity: 'Fundraising Gala', notes: 'Event coordinator' },
      { date: '2025-09-20', hours: 3, activity: 'Social Media Campaign' },
      { date: '2025-09-10', hours: 5, activity: 'Community Cleanup' },
    ],
    engagementScore: 92,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'David Turner',
      relationship: 'Husband',
      phone: '(555) 700-0002',
    },
    notes: 'Excellent event coordinator. Very reliable and energetic.',
  },
  {
    id: 'VOL-002',
    name: 'Marcus Williams',
    email: 'marcus.williams@email.com',
    phone: '(555) 700-0003',
    address: '5678 Helper St, Seattle, WA 98102',
    entityId: 'awakenings',
    totalHours: 128,
    sessionCount: 18,
    firstVolunteered: '2024-06-10',
    lastVolunteered: '2025-10-05',
    volunteerType: 'regular',
    skills: ['Mentoring', 'Teaching', 'Public Speaking'],
    availability: ['Weekday Mornings', 'Weekends'],
    interests: ['Youth Mentorship', 'Education'],
    volunteerHistory: [
      { date: '2025-10-05', hours: 3, activity: 'Youth Mentorship Session' },
      { date: '2025-09-28', hours: 4, activity: 'Educational Workshop' },
      { date: '2025-09-15', hours: 3, activity: 'Youth Mentorship Session' },
    ],
    engagementScore: 88,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Angela Williams',
      relationship: 'Wife',
      phone: '(555) 700-0004',
    },
    notes: 'Great with youth. Former teacher with 15 years experience.',
  },
  {
    id: 'VOL-003',
    name: 'Sophie Chen',
    email: 'sophie.chen@email.com',
    phone: '(555) 700-0005',
    address: '9012 Volunteer Ave, Seattle, WA 98103',
    entityId: 'awakenings',
    totalHours: 64,
    sessionCount: 12,
    firstVolunteered: '2024-11-05',
    lastVolunteered: '2025-09-30',
    volunteerType: 'occasional',
    skills: ['Graphic Design', 'Photography', 'Marketing'],
    availability: ['Flexible'],
    interests: ['Creative Projects', 'Marketing'],
    volunteerHistory: [
      { date: '2025-09-30', hours: 5, activity: 'Event Photography' },
      { date: '2025-08-15', hours: 6, activity: 'Marketing Materials Design' },
      { date: '2025-07-20', hours: 4, activity: 'Website Update' },
    ],
    engagementScore: 75,
    backgroundCheckStatus: 'not-required',
    emergencyContact: {
      name: 'Michael Chen',
      relationship: 'Brother',
      phone: '(555) 700-0006',
    },
    notes: 'Talented designer. Available for creative projects on flexible schedule.',
  },

  // Bloom Strong Volunteers
  {
    id: 'VOL-004',
    name: 'Daniel Foster',
    email: 'daniel.foster@email.com',
    phone: '(555) 800-0001',
    address: '2345 Wellness Dr, Tacoma, WA 98402',
    entityId: 'bloom-strong',
    totalHours: 310,
    sessionCount: 45,
    firstVolunteered: '2023-08-12',
    lastVolunteered: '2025-10-09',
    volunteerType: 'regular',
    skills: ['Counseling', 'Group Facilitation', 'Crisis Intervention'],
    availability: ['Weekday Evenings', 'Weekends'],
    interests: ['Mental Health Support', 'Peer Counseling'],
    volunteerHistory: [
      { date: '2025-10-09', hours: 3, activity: 'Support Group Facilitation' },
      { date: '2025-10-02', hours: 4, activity: 'Wellness Workshop' },
      { date: '2025-09-25', hours: 3, activity: 'Support Group Facilitation' },
      { date: '2025-09-18', hours: 4, activity: 'Community Wellness Event' },
    ],
    engagementScore: 96,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Rachel Foster',
      relationship: 'Sister',
      phone: '(555) 800-0002',
    },
    notes: 'Licensed counselor volunteering time. Exceptional with support groups.',
  },
  {
    id: 'VOL-005',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@email.com',
    phone: '(555) 800-0003',
    address: '6789 Support Way, Tacoma, WA 98403',
    entityId: 'bloom-strong',
    totalHours: 156,
    sessionCount: 24,
    firstVolunteered: '2024-03-20',
    lastVolunteered: '2025-10-07',
    volunteerType: 'regular',
    skills: ['Yoga Instruction', 'Meditation', 'Wellness Coaching'],
    availability: ['Mornings', 'Weekends'],
    interests: ['Holistic Wellness', 'Mindfulness'],
    volunteerHistory: [
      { date: '2025-10-07', hours: 2, activity: 'Morning Yoga Class' },
      { date: '2025-09-30', hours: 3, activity: 'Meditation Workshop' },
      { date: '2025-09-23', hours: 2, activity: 'Morning Yoga Class' },
    ],
    engagementScore: 84,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Carlos Martinez',
      relationship: 'Husband',
      phone: '(555) 800-0004',
    },
    notes: 'Certified yoga instructor. Brings calming presence to programs.',
  },

  // Bonfire Volunteers
  {
    id: 'VOL-006',
    name: 'Tyler Johnson',
    email: 'tyler.johnson@email.com',
    phone: '(555) 900-0001',
    address: '3456 Youth Center Rd, Bellevue, WA 98004',
    entityId: 'bonfire',
    totalHours: 420,
    sessionCount: 68,
    firstVolunteered: '2022-09-15',
    lastVolunteered: '2025-10-10',
    volunteerType: 'regular',
    skills: ['Youth Mentoring', 'Sports Coaching', 'Activity Planning'],
    availability: ['Afternoons', 'Weekends'],
    interests: ['Youth Development', 'Sports Programs'],
    volunteerHistory: [
      { date: '2025-10-10', hours: 4, activity: 'After-School Program' },
      { date: '2025-10-08', hours: 5, activity: 'Sports Coaching' },
      { date: '2025-10-03', hours: 4, activity: 'After-School Program' },
      { date: '2025-09-26', hours: 6, activity: 'Weekend Youth Camp' },
    ],
    engagementScore: 98,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Sarah Johnson',
      relationship: 'Mother',
      phone: '(555) 900-0002',
    },
    notes: 'Most dedicated volunteer. Kids love him. Former college athlete.',
  },
  {
    id: 'VOL-007',
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    phone: '(555) 900-0003',
    address: '7890 Activity Ln, Bellevue, WA 98005',
    entityId: 'bonfire',
    totalHours: 189,
    sessionCount: 28,
    firstVolunteered: '2023-11-10',
    lastVolunteered: '2025-10-06',
    volunteerType: 'regular',
    skills: ['Arts & Crafts', 'Music', 'Creative Writing'],
    availability: ['Weekday Afternoons', 'Occasional Weekends'],
    interests: ['Creative Arts', 'Youth Programs'],
    volunteerHistory: [
      { date: '2025-10-06', hours: 3, activity: 'Art Workshop' },
      { date: '2025-09-29', hours: 4, activity: 'Creative Writing Class' },
      { date: '2025-09-15', hours: 3, activity: 'Music Lessons' },
    ],
    engagementScore: 86,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Robert Davis',
      relationship: 'Father',
      phone: '(555) 900-0004',
    },
    notes: 'Art teacher. Brings creativity and patience to youth programs.',
  },

  // BreakThrough Volunteers
  {
    id: 'VOL-008',
    name: 'Nathan Brown',
    email: 'nathan.brown@email.com',
    phone: '(555) 100-0001',
    address: '4567 Tutor St, Redmond, WA 98052',
    entityId: 'breakthrough',
    totalHours: 276,
    sessionCount: 52,
    firstVolunteered: '2023-05-20',
    lastVolunteered: '2025-10-09',
    volunteerType: 'regular',
    skills: ['Math Tutoring', 'Science Education', 'Test Prep'],
    availability: ['Evenings', 'Weekends'],
    interests: ['Academic Support', 'STEM Education'],
    volunteerHistory: [
      { date: '2025-10-09', hours: 3, activity: 'Math Tutoring' },
      { date: '2025-10-05', hours: 3, activity: 'Science Workshop' },
      { date: '2025-10-02', hours: 3, activity: 'Math Tutoring' },
      { date: '2025-09-28', hours: 4, activity: 'Test Prep Session' },
    ],
    engagementScore: 91,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Linda Brown',
      relationship: 'Mother',
      phone: '(555) 100-0002',
    },
    notes: 'Engineering graduate student. Excellent at explaining complex concepts.',
  },
  {
    id: 'VOL-009',
    name: 'Kayla White',
    email: 'kayla.white@email.com',
    phone: '(555) 100-0003',
    address: '8901 Education Ave, Redmond, WA 98053',
    entityId: 'breakthrough',
    totalHours: 142,
    sessionCount: 26,
    firstVolunteered: '2024-01-15',
    lastVolunteered: '2025-10-04',
    volunteerType: 'regular',
    skills: ['Reading Tutoring', 'ESL', 'Literacy Programs'],
    availability: ['Weekday Mornings'],
    interests: ['Literacy', 'Language Learning'],
    volunteerHistory: [
      { date: '2025-10-04', hours: 2, activity: 'Reading Tutoring' },
      { date: '2025-09-27', hours: 3, activity: 'ESL Class' },
      { date: '2025-09-20', hours: 2, activity: 'Reading Tutoring' },
    ],
    engagementScore: 82,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'James White',
      relationship: 'Husband',
      phone: '(555) 100-0004',
    },
    notes: 'Former librarian. Patient and encouraging with struggling readers.',
  },

  // Child & Youth Care Volunteers
  {
    id: 'VOL-010',
    name: 'Isabella Garcia',
    email: 'isabella.garcia@email.com',
    phone: '(555) 200-0001',
    address: '5678 Care Dr, Federal Way, WA 98003',
    entityId: 'child-youth-care',
    totalHours: 385,
    sessionCount: 64,
    firstVolunteered: '2022-07-10',
    lastVolunteered: '2025-10-08',
    volunteerType: 'regular',
    skills: ['Child Care', 'Activity Planning', 'First Aid'],
    availability: ['Weekdays', 'Weekends'],
    interests: ['Child Development', 'Foster Care Support'],
    volunteerHistory: [
      { date: '2025-10-08', hours: 6, activity: 'Childcare Support' },
      { date: '2025-10-01', hours: 5, activity: 'Family Event Coordination' },
      { date: '2025-09-24', hours: 6, activity: 'Childcare Support' },
    ],
    engagementScore: 94,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Miguel Garcia',
      relationship: 'Brother',
      phone: '(555) 200-0002',
    },
    notes: 'CPR and First Aid certified. Wonderful with children of all ages.',
  },
  {
    id: 'VOL-011',
    name: 'Christopher Lee',
    email: 'christopher.lee@email.com',
    phone: '(555) 200-0003',
    address: '9012 Support Rd, Auburn, WA 98001',
    entityId: 'child-youth-care',
    totalHours: 218,
    sessionCount: 38,
    firstVolunteered: '2023-09-05',
    lastVolunteered: '2025-10-05',
    volunteerType: 'regular',
    skills: ['Transportation', 'Handyman', 'Event Setup'],
    availability: ['Flexible'],
    interests: ['Practical Support', 'Facility Maintenance'],
    volunteerHistory: [
      { date: '2025-10-05', hours: 4, activity: 'Facility Repairs' },
      { date: '2025-09-20', hours: 5, activity: 'Transportation Services' },
      { date: '2025-09-10', hours: 6, activity: 'Event Setup' },
    ],
    engagementScore: 87,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Susan Lee',
      relationship: 'Wife',
      phone: '(555) 200-0004',
    },
    notes: 'Retired contractor. Handles all facility needs and transportation.',
  },

  // Hugs Center, Nepal Volunteers
  {
    id: 'VOL-012',
    name: 'Sita Sharma',
    email: 'sita.sharma@email.com',
    phone: '+977-1-456-7890',
    address: 'Kathmandu, Nepal',
    entityId: 'hugs-center',
    totalHours: 520,
    sessionCount: 86,
    firstVolunteered: '2021-03-15',
    lastVolunteered: '2025-10-08',
    volunteerType: 'regular',
    skills: ['Teaching', 'Translation', 'Community Organizing'],
    availability: ['Full-time'],
    interests: ['Education', 'Community Development'],
    volunteerHistory: [
      { date: '2025-10-08', hours: 8, activity: 'Teaching Classes' },
      { date: '2025-10-01', hours: 6, activity: 'Community Event' },
      { date: '2025-09-24', hours: 8, activity: 'Teaching Classes' },
    ],
    engagementScore: 99,
    backgroundCheckStatus: 'approved',
    emergencyContact: {
      name: 'Ram Sharma',
      relationship: 'Father',
      phone: '+977-1-456-7891',
    },
    notes: 'Local teacher who volunteers full-time. Invaluable community connection.',
  },

  // Pure Water Volunteers
  {
    id: 'VOL-013',
    name: 'Amanda Brooks',
    email: 'amanda.brooks@email.com',
    phone: '(555) 300-0001',
    address: '6789 Tech Way, Spokane, WA 99201',
    entityId: 'pure-water',
    totalHours: 164,
    sessionCount: 22,
    firstVolunteered: '2023-04-10',
    lastVolunteered: '2025-09-28',
    volunteerType: 'occasional',
    skills: ['Engineering', 'Project Management', 'Technical Writing'],
    availability: ['Occasional Weekends'],
    interests: ['Water Infrastructure', 'International Development'],
    volunteerHistory: [
      { date: '2025-09-28', hours: 8, activity: 'Field Project Support' },
      { date: '2025-08-15', hours: 10, activity: 'Technical Documentation' },
      { date: '2025-07-20', hours: 6, activity: 'Equipment Testing' },
    ],
    engagementScore: 78,
    backgroundCheckStatus: 'not-required',
    emergencyContact: {
      name: 'Tom Brooks',
      relationship: 'Husband',
      phone: '(555) 300-0002',
    },
    notes: 'Civil engineer. Provides technical expertise on water projects.',
  },
  {
    id: 'VOL-014',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@email.com',
    phone: '(555) 300-0003',
    address: '7890 Service St, Vancouver, WA 98660',
    entityId: 'pure-water',
    totalHours: 96,
    sessionCount: 16,
    firstVolunteered: '2024-06-05',
    lastVolunteered: '2025-10-02',
    volunteerType: 'event-based',
    skills: ['Fundraising', 'Social Media', 'Event Planning'],
    availability: ['Event-based'],
    interests: ['Fundraising', 'Awareness Campaigns'],
    volunteerHistory: [
      { date: '2025-10-02', hours: 6, activity: 'Fundraising Event' },
      { date: '2025-08-10', hours: 8, activity: 'Awareness Walk' },
      { date: '2025-06-15', hours: 5, activity: 'Social Media Campaign' },
    ],
    engagementScore: 72,
    backgroundCheckStatus: 'not-required',
    emergencyContact: {
      name: 'Alex Taylor',
      relationship: 'Sibling',
      phone: '(555) 300-0004',
    },
    notes: 'Event-focused volunteer. Great at mobilizing people for fundraisers.',
  },
];

export const getVolunteerProfile = (volunteerName: string, entityId: EntityId): VolunteerProfile | null => {
  const volunteer = allVolunteerProfiles.find(v => v.name === volunteerName);
  if (!volunteer) return null;
  
  if (entityId !== 'all' && volunteer.entityId !== entityId) {
    return null;
  }
  
  return volunteer;
};

export const getAllVolunteers = (entityId: EntityId): VolunteerProfile[] => {
  if (entityId === 'all') {
    return allVolunteerProfiles;
  }
  
  return allVolunteerProfiles.filter(volunteer => volunteer.entityId === entityId);
};

// Accounting Data
export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
  entityId?: EntityId;
  reconciled: boolean;
  vendor?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  entityId: EntityId;
  vendor: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'reimbursed';
  submittedBy: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface ReimbursementRequest {
  id: string;
  entityId: EntityId;
  expenseIds: string[];
  totalAmount: number;
  requestedBy: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  paymentMethod?: 'ACH' | 'Check';
}

const allBankTransactions: BankTransaction[] = [
  // Unreconciled transactions
  {
    id: 'TXN-001',
    date: '2025-10-09',
    description: 'Amazon Web Services - Monthly Hosting',
    amount: -245.50,
    type: 'debit',
    vendor: 'Amazon Web Services',
    reconciled: false,
  },
  {
    id: 'TXN-002',
    date: '2025-10-08',
    description: 'Office Depot - Supplies',
    amount: -156.23,
    type: 'debit',
    vendor: 'Office Depot',
    reconciled: false,
  },
  {
    id: 'TXN-003',
    date: '2025-10-08',
    description: 'Donor Contribution - John Smith',
    amount: 5000.00,
    type: 'credit',
    reconciled: false,
  },
  {
    id: 'TXN-004',
    date: '2025-10-07',
    description: 'Event Space Rental - Community Center',
    amount: -850.00,
    type: 'debit',
    vendor: 'Seattle Community Center',
    reconciled: false,
  },
  {
    id: 'TXN-005',
    date: '2025-10-07',
    description: 'Catering Services - Event Meals',
    amount: -425.75,
    type: 'debit',
    vendor: 'Fresh & Local Catering',
    reconciled: false,
  },
  // Reconciled transactions
  {
    id: 'TXN-006',
    date: '2025-10-05',
    description: 'Utility Payment - Electric',
    amount: -342.18,
    type: 'debit',
    category: 'Utilities',
    entityId: 'awakenings',
    vendor: 'Seattle Power & Light',
    reconciled: true,
  },
  {
    id: 'TXN-007',
    date: '2025-10-04',
    description: 'Program Materials - Youth Supplies',
    amount: -567.89,
    type: 'debit',
    category: 'Program Expenses',
    entityId: 'bonfire',
    vendor: 'Educational Supply Co',
    reconciled: true,
  },
  {
    id: 'TXN-008',
    date: '2025-10-03',
    description: 'Donor Contribution - Sarah Johnson',
    amount: 2500.00,
    type: 'credit',
    category: 'Donations',
    entityId: 'bloom-strong',
    reconciled: true,
  },
];

const allExpenses: Expense[] = [
  // Awakenings
  {
    id: 'EXP-001',
    date: '2025-10-08',
    description: 'Community Event Supplies',
    amount: 234.56,
    category: 'Program Expenses',
    entityId: 'awakenings',
    vendor: 'Party City',
    receiptUrl: '/receipts/exp-001.pdf',
    status: 'pending',
    submittedBy: 'Sarah Miller',
    submittedDate: '2025-10-08',
  },
  {
    id: 'EXP-002',
    date: '2025-10-06',
    description: 'Social Media Advertising',
    amount: 150.00,
    category: 'Marketing',
    entityId: 'awakenings',
    vendor: 'Facebook Ads',
    status: 'approved',
    submittedBy: 'Sarah Miller',
    submittedDate: '2025-10-06',
    approvedBy: 'Admin',
    approvedDate: '2025-10-07',
  },
  // Bloom Strong
  {
    id: 'EXP-003',
    date: '2025-10-07',
    description: 'Wellness Workshop Materials',
    amount: 312.45,
    category: 'Program Expenses',
    entityId: 'bloom-strong',
    vendor: 'Whole Health Supplies',
    receiptUrl: '/receipts/exp-003.pdf',
    status: 'approved',
    submittedBy: 'Michael Chen',
    submittedDate: '2025-10-07',
    approvedBy: 'Admin',
    approvedDate: '2025-10-08',
  },
  {
    id: 'EXP-004',
    date: '2025-10-05',
    description: 'Yoga Equipment',
    amount: 456.78,
    category: 'Program Expenses',
    entityId: 'bloom-strong',
    vendor: 'Yoga Direct',
    status: 'reimbursed',
    submittedBy: 'Michael Chen',
    submittedDate: '2025-10-05',
    approvedBy: 'Admin',
    approvedDate: '2025-10-06',
  },
  // Bonfire
  {
    id: 'EXP-005',
    date: '2025-10-09',
    description: 'Youth Sports Equipment',
    amount: 678.90,
    category: 'Program Expenses',
    entityId: 'bonfire',
    vendor: 'Sports Authority',
    receiptUrl: '/receipts/exp-005.pdf',
    status: 'pending',
    submittedBy: 'Lisa Johnson',
    submittedDate: '2025-10-09',
  },
  {
    id: 'EXP-006',
    date: '2025-10-04',
    description: 'Art Supplies for Classes',
    amount: 189.50,
    category: 'Program Expenses',
    entityId: 'bonfire',
    vendor: 'Michaels',
    status: 'approved',
    submittedBy: 'Lisa Johnson',
    submittedDate: '2025-10-04',
    approvedBy: 'Admin',
    approvedDate: '2025-10-05',
  },
  // BreakThrough
  {
    id: 'EXP-007',
    date: '2025-10-06',
    description: 'Tutoring Materials & Books',
    amount: 245.67,
    category: 'Educational Materials',
    entityId: 'breakthrough',
    vendor: 'Amazon',
    status: 'approved',
    submittedBy: 'Robert Taylor',
    submittedDate: '2025-10-06',
    approvedBy: 'Admin',
    approvedDate: '2025-10-07',
  },
  // Pure Water
  {
    id: 'EXP-008',
    date: '2025-10-08',
    description: 'Water Filtration Equipment',
    amount: 1250.00,
    category: 'Project Equipment',
    entityId: 'pure-water',
    vendor: 'Water Systems Inc',
    receiptUrl: '/receipts/exp-008.pdf',
    status: 'pending',
    submittedBy: 'David Kim',
    submittedDate: '2025-10-08',
  },
];

const allReimbursementRequests: ReimbursementRequest[] = [
  {
    id: 'REIMB-001',
    entityId: 'awakenings',
    expenseIds: ['EXP-002'],
    totalAmount: 150.00,
    requestedBy: 'Sarah Miller',
    requestedDate: '2025-10-07',
    status: 'pending',
  },
  {
    id: 'REIMB-002',
    entityId: 'bloom-strong',
    expenseIds: ['EXP-003'],
    totalAmount: 312.45,
    requestedBy: 'Michael Chen',
    requestedDate: '2025-10-08',
    status: 'approved',
    approvedBy: 'Admin',
    approvedDate: '2025-10-09',
  },
  {
    id: 'REIMB-003',
    entityId: 'bonfire',
    expenseIds: ['EXP-006'],
    totalAmount: 189.50,
    requestedBy: 'Lisa Johnson',
    requestedDate: '2025-10-05',
    status: 'paid',
    approvedBy: 'Admin',
    approvedDate: '2025-10-06',
    paidDate: '2025-10-07',
    paymentMethod: 'ACH',
  },
];

export const getBankTransactions = (entityId: EntityId, reconciledOnly?: boolean): BankTransaction[] => {
  let transactions = allBankTransactions;
  
  if (reconciledOnly !== undefined) {
    transactions = transactions.filter(t => t.reconciled === reconciledOnly);
  }
  
  if (entityId === 'all') {
    return transactions;
  }
  
  return transactions.filter(t => !t.entityId || t.entityId === entityId);
};

export const getExpenses = (entityId: EntityId, status?: Expense['status']): Expense[] => {
  let expenses = allExpenses;
  
  if (status) {
    expenses = expenses.filter(e => e.status === status);
  }
  
  if (entityId === 'all') {
    return expenses;
  }
  
  return expenses.filter(e => e.entityId === entityId);
};

export const getReimbursementRequests = (entityId: EntityId, status?: ReimbursementRequest['status']): ReimbursementRequest[] => {
  let requests = allReimbursementRequests;
  
  if (status) {
    requests = requests.filter(r => r.status === status);
  }
  
  if (entityId === 'all') {
    return requests;
  }
  
  return requests.filter(r => r.entityId === entityId);
};

export const getExpenseById = (expenseId: string): Expense | null => {
  return allExpenses.find(e => e.id === expenseId) || null;
};
