import { EntityId } from '../contexts/AppContext';

export interface BalanceSheetData {
  entityId: EntityId;
  asOfDate: string;
  assets: {
    ifmCheckingPeoplesBank: number; // 1000
    ifmSavingsPeoplesBank: number; // 1010
    investmentAdelfiCreditUnion: number; // 1020
    ministryPartnersCD: number; // 1021
    peoplesBankMoneyMarket: number; // 1022
    rbcCapitalMarkets: number; // 1023
    stripePayments: number; // 1131.999999
    totalAssets: number;
  };
  liabilities: {
    suspense: number; // 2100
    taxesPayable: number; // 2210
    totalLiabilities: number;
  };
  equity: {
    infocusMinisteriesFundBalance: number; // 3116
    theUprisingFundBalance: number; // 3127
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

export interface ProfitLossData {
  entityId: EntityId;
  startDate: string;
  endDate: string;
  income: {
    directPublicSupport: number; // 4500
    initialFee: number; // 4510
    interestIncome: number; // 4520
    miscellaneousRevenue: number; // 4530
    salesFromInvenorites: number; // 4600
    totalIncome: number;
  };
  expense: {
    advertisingExpenses: number; // 5001
    bankFees: number; // 5002
    boardEducation: number; // 5003
    fundraisingExpenses: number; // 5011
    officeSupplies: number; // 5014
    payrollExpenses: number; // 5019
    postageMailingService: number; // 5020
    rent: number; // 5023
    telephoneTelecommunications: number; // 5028
    donorAppreciation: number; // 5033
    businessExpenses: number; // 5034
    insurancePremium: number; // 5013
    meals: number; // 5014 (duplicate, will handle separately)
    parking: number; // 5018
    supplies: number; // 5027
    transportation: number; // 5031
    travelMeetings: number; // 5032
    uniformLinens: number; // 5000
    adminFee: number; // 5000 (duplicate, will handle)
    professionalServices: number; // 5026
    softwarePrograms: number; // 5026 (duplicate, will handle)
    miscellaneousExpense: number; // 5000 (duplicate)
    reconciliationDiscrepancies: number; // 6001
    askMyAccountant: number; // 6004
    totalExpense: number;
  };
  netIncome: number;
}

export interface CashFlowData {
  entityId: EntityId;
  startDate: string;
  endDate: string;
  operatingActivities: {
    netIncome: number;
    adjustments: {
      depreciation: number;
      changesInReceivables: number;
      changesInPayables: number;
      total: number;
    };
    netCashFromOperations: number;
  };
  investingActivities: {
    purchaseOfEquipment: number;
    netCashFromInvesting: number;
  };
  financingActivities: {
    proceedsFromLoans: number;
    repaymentOfLoans: number;
    netCashFromFinancing: number;
  };
  netChangeInCash: number;
  cashBeginningOfPeriod: number;
  cashEndOfPeriod: number;
}

// Mock Balance Sheet Data - Based on real account structure
export const balanceSheetData: Record<string, BalanceSheetData> = {
  'awakenings': {
    entityId: 'awakenings',
    asOfDate: '2025-10-29',
    assets: {
      ifmCheckingPeoplesBank: 45250.00, // 1000
      ifmSavingsPeoplesBank: 8500.00, // 1010
      investmentAdelfiCreditUnion: 12000.00, // 1020
      ministryPartnersCD: 15000.00, // 1021
      peoplesBankMoneyMarket: 8200.00, // 1022
      rbcCapitalMarkets: 5800.00, // 1023
      stripePayments: 3500.00, // 1131.999999
      totalAssets: 98250.00,
    },
    liabilities: {
      suspense: 4200.00, // 2100
      taxesPayable: 2150.00, // 2210
      totalLiabilities: 6350.00,
    },
    equity: {
      infocusMinisteriesFundBalance: 0.00, // 3116 (only for InFocus)
      theUprisingFundBalance: 91900.00, // 3127 (Awakenings fund balance)
      totalEquity: 91900.00,
    },
    totalLiabilitiesAndEquity: 98250.00,
  },
  'bloom-strong': {
    entityId: 'bloom-strong',
    asOfDate: '2025-10-29',
    assets: {
      ifmCheckingPeoplesBank: 38900.00,
      ifmSavingsPeoplesBank: 5200.00,
      investmentAdelfiCreditUnion: 8500.00,
      ministryPartnersCD: 9500.00,
      peoplesBankMoneyMarket: 5200.00,
      rbcCapitalMarkets: 3800.00,
      stripePayments: 2100.00,
      totalAssets: 73200.00,
    },
    liabilities: {
      suspense: 2800.00,
      taxesPayable: 1400.00,
      totalLiabilities: 4200.00,
    },
    equity: {
      infocusMinisteriesFundBalance: 0.00,
      theUprisingFundBalance: 69000.00,
      totalEquity: 69000.00,
    },
    totalLiabilitiesAndEquity: 73200.00,
  },
  'bonfire': {
    entityId: 'bonfire',
    asOfDate: '2025-10-29',
    assets: {
      ifmCheckingPeoplesBank: 52300.00,
      ifmSavingsPeoplesBank: 6800.00,
      investmentAdelfiCreditUnion: 15000.00,
      ministryPartnersCD: 12000.00,
      peoplesBankMoneyMarket: 7500.00,
      rbcCapitalMarkets: 4800.00,
      stripePayments: 2900.00,
      totalAssets: 101300.00,
    },
    liabilities: {
      suspense: 5600.00,
      taxesPayable: 1850.00,
      totalLiabilities: 7450.00,
    },
    equity: {
      infocusMinisteriesFundBalance: 0.00,
      theUprisingFundBalance: 93850.00,
      totalEquity: 93850.00,
    },
    totalLiabilitiesAndEquity: 101300.00,
  },
};

// Mock P&L Data - Based on real account structure
export const profitLossData: Record<string, ProfitLossData> = {
  'awakenings': {
    entityId: 'awakenings',
    startDate: '2025-01-01',
    endDate: '2025-10-29',
    income: {
      directPublicSupport: 47204.68, // 4500
      initialFee: 0.00, // 4510
      interestIncome: 0.00, // 4520
      miscellaneousRevenue: 0.00, // 4530
      salesFromInvenorites: 0.00, // 4600
      totalIncome: 47204.68,
    },
    expense: {
      advertisingExpenses: 2855.35, // 5001
      bankFees: 1432.01, // 5002
      boardEducation: 0.00, // 5003
      fundraisingExpenses: 0.00, // 5011
      officeSupplies: 0.00, // 5014
      payrollExpenses: 12174.16, // 5019
      postageMailingService: 0.00, // 5020
      rent: 1500.00, // 5023
      telephoneTelecommunications: 86.53, // 5028
      donorAppreciation: 0.00, // 5033
      businessExpenses: 70.38, // 5034
      insurancePremium: 50.00, // 5013
      meals: 3501.14, // 5014
      parking: 41.00, // 5018
      supplies: 0.00, // 5027
      transportation: 4448.15, // 5031
      travelMeetings: 171.39, // 5032
      uniformLinens: 3276.80, // 5000
      adminFee: 0.00, // 5000
      professionalServices: 0.00, // 5026
      softwarePrograms: 546.92, // 5026
      miscellaneousExpense: 0.00, // 5000
      reconciliationDiscrepancies: 0.00, // 6001
      askMyAccountant: 1701.03, // 6004
      totalExpense: 31854.86,
    },
    netIncome: 15349.82,
  },
  'bloom-strong': {
    entityId: 'bloom-strong',
    startDate: '2025-01-01',
    endDate: '2025-10-29',
    income: {
      directPublicSupport: 32500.00,
      initialFee: 250.00,
      interestIncome: 125.00,
      miscellaneousRevenue: 180.00,
      salesFromInvenorites: 425.00,
      totalIncome: 33480.00,
    },
    expense: {
      advertisingExpenses: 1850.00,
      bankFees: 925.00,
      boardEducation: 450.00,
      fundraisingExpenses: 2100.00,
      officeSupplies: 650.00,
      payrollExpenses: 8500.00,
      postageMailingService: 325.00,
      rent: 1200.00,
      telephoneTelecommunications: 275.00,
      donorAppreciation: 180.00,
      businessExpenses: 220.00,
      insurancePremium: 425.00,
      meals: 1850.00,
      parking: 85.00,
      supplies: 750.00,
      transportation: 2100.00,
      travelMeetings: 950.00,
      uniformLinens: 1250.00,
      adminFee: 1850.00,
      professionalServices: 2200.00,
      softwarePrograms: 425.00,
      miscellaneousExpense: 150.00,
      reconciliationDiscrepancies: 75.00,
      askMyAccountant: 950.00,
      totalExpense: 28935.00,
    },
    netIncome: 4545.00,
  },
  'bonfire': {
    entityId: 'bonfire',
    startDate: '2025-01-01',
    endDate: '2025-10-29',
    income: {
      directPublicSupport: 58900.00,
      initialFee: 500.00,
      interestIncome: 285.00,
      miscellaneousRevenue: 420.00,
      salesFromInvenorites: 750.00,
      totalIncome: 60855.00,
    },
    expense: {
      advertisingExpenses: 3200.00,
      bankFees: 1650.00,
      boardEducation: 825.00,
      fundraisingExpenses: 3500.00,
      officeSupplies: 950.00,
      payrollExpenses: 15200.00,
      postageMailingService: 550.00,
      rent: 1800.00,
      telephoneTelecommunications: 425.00,
      donorAppreciation: 320.00,
      businessExpenses: 380.00,
      insurancePremium: 650.00,
      meals: 2850.00,
      parking: 125.00,
      supplies: 1250.00,
      transportation: 3500.00,
      travelMeetings: 1450.00,
      uniformLinens: 2100.00,
      adminFee: 2950.00,
      professionalServices: 3850.00,
      softwarePrograms: 725.00,
      miscellaneousExpense: 285.00,
      reconciliationDiscrepancies: 125.00,
      askMyAccountant: 1650.00,
      totalExpense: 50310.00,
    },
    netIncome: 10545.00,
  },
};

// Mock Cash Flow Data
export const cashFlowData: Record<string, CashFlowData> = {
  'awakenings': {
    entityId: 'awakenings',
    startDate: '2025-01-01',
    endDate: '2025-10-10',
    operatingActivities: {
      netIncome: 19700.00,
      adjustments: {
        depreciation: 8500.00,
        changesInReceivables: -3200.00,
        changesInPayables: 1800.00,
        total: 7100.00,
      },
      netCashFromOperations: 26800.00,
    },
    investingActivities: {
      purchaseOfEquipment: -15000.00,
      netCashFromInvesting: -15000.00,
    },
    financingActivities: {
      proceedsFromLoans: 10000.00,
      repaymentOfLoans: -5000.00,
      netCashFromFinancing: 5000.00,
    },
    netChangeInCash: 16800.00,
    cashBeginningOfPeriod: 28450.00,
    cashEndOfPeriod: 45250.00,
  },
  'bloom-strong': {
    entityId: 'bloom-strong',
    startDate: '2025-01-01',
    endDate: '2025-10-10',
    operatingActivities: {
      netIncome: 16200.00,
      adjustments: {
        depreciation: 4800.00,
        changesInReceivables: -2100.00,
        changesInPayables: 1200.00,
        total: 3900.00,
      },
      netCashFromOperations: 20100.00,
    },
    investingActivities: {
      purchaseOfEquipment: -8000.00,
      netCashFromInvesting: -8000.00,
    },
    financingActivities: {
      proceedsFromLoans: 5000.00,
      repaymentOfLoans: -3000.00,
      netCashFromFinancing: 2000.00,
    },
    netChangeInCash: 14100.00,
    cashBeginningOfPeriod: 24800.00,
    cashEndOfPeriod: 38900.00,
  },
  'bonfire': {
    entityId: 'bonfire',
    startDate: '2025-01-01',
    endDate: '2025-10-10',
    operatingActivities: {
      netIncome: 27200.00,
      adjustments: {
        depreciation: 10500.00,
        changesInReceivables: -4200.00,
        changesInPayables: 2400.00,
        total: 8700.00,
      },
      netCashFromOperations: 35900.00,
    },
    investingActivities: {
      purchaseOfEquipment: -22000.00,
      netCashFromInvesting: -22000.00,
    },
    financingActivities: {
      proceedsFromLoans: 15000.00,
      repaymentOfLoans: -7500.00,
      netCashFromFinancing: 7500.00,
    },
    netChangeInCash: 21400.00,
    cashBeginningOfPeriod: 30900.00,
    cashEndOfPeriod: 52300.00,
  },
};

export const getBalanceSheet = (entityId: EntityId): BalanceSheetData | null => {
  if (entityId === 'all') return null;
  return balanceSheetData[entityId] || null;
};

export const getProfitLoss = (entityId: EntityId): ProfitLossData | null => {
  if (entityId === 'all') return null;
  return profitLossData[entityId] || null;
};

export const getCashFlow = (entityId: EntityId): CashFlowData | null => {
  if (entityId === 'all') return null;
  return cashFlowData[entityId] || null;
};
