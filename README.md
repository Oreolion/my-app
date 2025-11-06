# Personal Finance Tracker

A comprehensive personal finance management application built with Next.js 15, TypeScript, and shadcn/ui. Track your income and expenses with powerful categorization, filtering, and visualization tools.

## Features

### Core Features

- **Transaction Management**: Record income and expense transactions with amount, date, category, and optional notes
- **Smart Categorization**: Pre-defined categories for income (Salary, Freelance, Investments) and expenses (Food, Transportation, Utilities, Entertainment, Shopping)
- **Custom Categories**: Create custom income and expense categories tailored to your needs
- **Advanced Filtering**: Filter transactions by type, category, date range, and search text
- **Sorting Options**: Sort transactions by date (newest/oldest first) or amount (highest/lowest)
- **Financial Analytics**: Visual dashboards with charts and graphs showing income vs expenses trends
- **Data Persistence**: All data is stored locally in browser storage, persisting across sessions
- **Responsive Design**: Fully responsive interface optimized for desktop, tablet, and mobile devices

### Data Visualization

- **Summary Cards**: Quick overview of total income, total expenses, and current balance
- **Pie Charts**: Visual breakdown of income vs expenses and expense distribution by category
- **Line Charts**: Monthly trend analysis showing income and expense patterns over time
- **Bar Charts**: Category-wise comparison of income and expenses
- **Data Summary**: Transaction count, category count, and storage used statistics

### Data Export

- **CSV Export**: Download your transactions in CSV format for use in spreadsheet applications
- **JSON Backup**: Export complete backup of your data including transactions and custom categories
- **Data Management**: Clear all data with safety confirmation (danger zone)

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **State Management**: React Context API
- **Storage**: Browser LocalStorage API

## Installation & Setup

### Option 1: Using shadcn CLI (Recommended)

\`\`\`bash
# Clone the repository or download the code
git clone <repository-url>

# Install dependencies using shadcn CLI
npx shadcn@latest init

# Follow the prompts and select your preferences

# Run development server
npm run dev
\`\`\`

### Option 2: Manual Setup

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Usage Guide

### Adding Transactions

1. Navigate to the **"Add Transaction"** tab
2. Select transaction type (Income or Expense)
3. Enter the amount
4. Select a category (or add a new one in the Categories tab)
5. Choose the transaction date
6. Add optional notes
7. Click **"Add Transaction"**

### Managing Categories

1. Go to the **"Categories"** tab
2. Enter a new category name
3. Select the type (Income or Expense)
4. Click **"Add"**
5. View all categories organized by type
6. Delete categories (only if no transactions are using them)

### Viewing & Filtering Transactions

1. Navigate to the **"Transactions"** tab
2. Use filters to:
   - **Search**: Find transactions by category or notes
   - **Type Filter**: Show All, Income, or Expense only
   - **Category Filter**: Filter by specific category
   - **Sort By**: Arrange by date or amount
3. View transaction details including date, category, type, amount, and notes
4. Delete transactions using the trash icon

### Analyzing Your Finances

1. Go to the **"Analytics"** tab to see:
   - Income vs Expense overview (pie chart)
   - Monthly trends (line chart)
   - Category breakdown (bar chart)
   - Expense distribution (pie chart)
2. Charts automatically update as you add transactions

### Exporting Data

1. Navigate to the **"Export & Settings"** tab
2. **Export CSV**: Download transactions for spreadsheet analysis
3. **Export Backup**: Create a complete JSON backup of all data
4. **Data Summary**: View statistics about your stored data

### Data Privacy & Security

- All data is stored locally in your browser using LocalStorage
- No data is sent to external servers
- Clearing browser storage will delete all your data
- Create regular backups using the JSON export feature

## Data Structure

### Transaction Object
\`\`\`typescript
{
  id: string              // Unique identifier
  type: 'income' | 'expense'
  amount: number          // Transaction amount
  category: string        // Category name
  date: string           // ISO date string (YYYY-MM-DD)
  notes?: string         // Optional notes
}
\`\`\`

### Category Object
\`\`\`typescript
{
  id: string                    // Unique identifier
  name: string                  // Category name
  type: 'income' | 'expense'   // Category type
}
\`\`\`

## Browser Compatibility

- Chrome/Edge: Latest versions
- Firefox: Latest versions
- Safari: Latest versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance Notes

- LocalStorage limit is typically 5-10MB depending on the browser
- The app efficiently handles thousands of transactions
- Charts and analytics update in real-time as data changes
- Responsive design ensures smooth performance on all devices

## Tips for Best Results

1. **Organize Categories**: Create meaningful categories that match your spending patterns
2. **Be Consistent**: Use the same category names for similar transactions
3. **Regular Backups**: Export JSON backups periodically
4. **Monthly Review**: Check analytics monthly to understand spending patterns
5. **Realistic Budgeting**: Use transaction history to set realistic budgets

## Troubleshooting

### Data Not Persisting
- Check if LocalStorage is enabled in browser settings
- Ensure you're not in private/incognito mode
- Try clearing browser cache and reloading

### Charts Not Showing
- Make sure you have transactions recorded
- Analytics require at least one transaction to display
- Try refreshing the page if charts don't load

### Export Issues
- Ensure your browser allows downloads
- Check pop-up blocker settings
- Try a different browser if export fails

## Browser Storage Limitations

Each browser typically allows 5-10MB of LocalStorage. The app will notify you if approaching limits. Create backups before hitting storage limits.

## Future Enhancements

Potential features for future versions:
- Budget goals and tracking
- Recurring transaction templates
- Multi-currency support
- Email reports
- Cloud sync option
- Mobile app version

## License

This project is free to use and modify for personal use.

## Support

For issues or questions:
1. Check this README thoroughly
2. Clear browser cache and restart the app
3. Export your data as a backup before troubleshooting
4. Create backups regularly to avoid data loss

---

**Happy tracking! Monitor your finances effectively with Personal Finance Tracker.**
