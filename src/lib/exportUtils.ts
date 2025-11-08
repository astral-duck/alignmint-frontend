// Utility functions for exporting reports to XLSX and PDF formats

// Export to Excel (XLSX)
export const exportToExcel = (
  data: any[][],
  headers: string[],
  filename: string,
  sheetName: string = 'Report'
) => {
  try {
    // Dynamic import of xlsx library
    import('xlsx').then((XLSX) => {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

      // Set column widths
      const colWidths = headers.map(() => ({ wch: 20 }));
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Generate and download file
      XLSX.writeFile(wb, `${filename}.xlsx`);
    });
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

// Export to PDF
export const exportToPDF = (
  title: string,
  subtitle: string,
  sections: { heading?: string; data: any[][]; headers: string[] }[],
  filename: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  try {
    // Dynamic import of jspdf and jspdf-autotable
    Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]).then(([{ default: jsPDF }]) => {
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4',
      });

      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 20);

      // Add subtitle
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(subtitle, 14, 28);

      let yPosition = 35;

      // Add each section
      sections.forEach((section, index) => {
        // Add section heading if provided
        if (section.heading) {
          doc.setFontSize(14);
          doc.setTextColor(0);
          doc.text(section.heading, 14, yPosition);
          yPosition += 8;
        }

        // Add table using autoTable
        (doc as any).autoTable({
          startY: yPosition,
          head: [section.headers],
          body: section.data,
          theme: 'striped',
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 9,
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250],
          },
          margin: { top: 10, left: 14, right: 14 },
        });

        // Update y position for next section
        yPosition = (doc as any).lastAutoTable.finalY + 10;

        // Add new page if needed
        if (index < sections.length - 1 && yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });

      // Save the PDF
      doc.save(`${filename}.pdf`);
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export to PDF');
  }
};

// Format currency for export
export const formatCurrencyForExport = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Format date for export
export const formatDateForExport = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Convert balance sheet data to export format
export const prepareBalanceSheetForExport = (balanceSheet: any, asOfDate: string) => {
  const data: any[][] = [];

  // Assets
  data.push(['ASSETS', '']);
  data.push(['IFM Checking Peoples Bank', formatCurrencyForExport(balanceSheet.assets.ifmCheckingPeoplesBank)]);
  data.push(['IFM Savings Peoples Bank', formatCurrencyForExport(balanceSheet.assets.ifmSavingsPeoplesBank)]);
  data.push(['Investment Adelfi Credit Union', formatCurrencyForExport(balanceSheet.assets.investmentAdelfiCreditUnion)]);
  data.push(['Ministry Partners CD', formatCurrencyForExport(balanceSheet.assets.ministryPartnersCD)]);
  data.push(['Peoples Bank Money Market', formatCurrencyForExport(balanceSheet.assets.peoplesBankMoneyMarket)]);
  data.push(['RBC Capital Markets', formatCurrencyForExport(balanceSheet.assets.rbcCapitalMarkets)]);
  data.push(['Stripe Payments', formatCurrencyForExport(balanceSheet.assets.stripePayments)]);
  data.push(['Total Assets', formatCurrencyForExport(balanceSheet.totalAssets)]);
  data.push(['', '']);

  // Liabilities
  data.push(['LIABILITIES', '']);
  data.push(['Suspense', formatCurrencyForExport(balanceSheet.liabilities.suspense)]);
  data.push(['Taxes Payable', formatCurrencyForExport(balanceSheet.liabilities.taxesPayable)]);
  data.push(['Total Liabilities', formatCurrencyForExport(balanceSheet.totalLiabilities)]);
  data.push(['', '']);

  // Equity
  data.push(['EQUITY', '']);
  data.push(['InFocus Ministries Fund Balance', formatCurrencyForExport(balanceSheet.equity.infocusMinisteriesFundBalance)]);
  data.push(['The Uprising Fund Balance', formatCurrencyForExport(balanceSheet.equity.theUprisingFundBalance)]);
  data.push(['Total Equity', formatCurrencyForExport(balanceSheet.totalEquity)]);
  data.push(['', '']);

  data.push(['TOTAL LIABILITIES & EQUITY', formatCurrencyForExport(balanceSheet.totalLiabilitiesAndEquity)]);

  return data;
};

// Convert P&L data to export format
export const prepareProfitLossForExport = (report: any) => {
  const data: any[][] = [];

  // Revenue
  data.push(['REVENUE', '']);
  Object.entries(report.revenue).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').trim();
    data.push([label.charAt(0).toUpperCase() + label.slice(1), formatCurrencyForExport(value as number)]);
  });
  data.push(['Total Revenue', formatCurrencyForExport(report.totalRevenue)]);
  data.push(['', '']);

  // Expenses
  data.push(['EXPENSES', '']);
  Object.entries(report.expenses).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').trim();
    data.push([label.charAt(0).toUpperCase() + label.slice(1), formatCurrencyForExport(value as number)]);
  });
  data.push(['Total Expenses', formatCurrencyForExport(report.totalExpenses)]);
  data.push(['', '']);

  data.push(['NET INCOME', formatCurrencyForExport(report.netIncome)]);

  return data;
};

// Convert Income Statement data to export format
export const prepareIncomeStatementForExport = (report: any) => {
  const data: any[][] = [];

  // Revenue by category
  data.push(['REVENUE BY CATEGORY', '']);
  report.revenueByCategory.forEach((item: any) => {
    data.push([item.category, formatCurrencyForExport(item.amount)]);
  });
  data.push(['Total Revenue', formatCurrencyForExport(report.totalRevenue)]);
  data.push(['', '']);

  // Expenses by category
  data.push(['EXPENSES BY CATEGORY', '']);
  report.expensesByCategory.forEach((item: any) => {
    data.push([item.category, formatCurrencyForExport(item.amount)]);
  });
  data.push(['Total Expenses', formatCurrencyForExport(report.totalExpenses)]);
  data.push(['', '']);

  data.push(['NET INCOME', formatCurrencyForExport(report.netIncome)]);

  return data;
};

// Convert Volunteer Hours data to export format
export const prepareVolunteerHoursForExport = (volunteerData: any[]) => {
  const data: any[][] = [];

  volunteerData.forEach((volunteer: any) => {
    data.push([
      volunteer.name,
      volunteer.role,
      volunteer.totalHours.toString(),
      volunteer.thisMonth.toString(),
      volunteer.lastActivity,
      volunteer.status,
    ]);
  });

  return data;
};
