"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import TransactionForm from "../components/transaction-form"
import TransactionList from "../components/transaction-list"
import CategoryManager from "../components/category-manager"
import FinanceCharts from "../components/finance-charts"
import ExportSettings from "../components/export-settings"
import { useTransactions } from "../context/transaction-context"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

export default function Dashboard() {
  const { transactions } = useTransactions()

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-primary">MONEY</h1>
                <span className="text-sm font-semibold text-accent uppercase tracking-widest">Tracker</span>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">Smart spending insights, one glance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Income Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border border-green-200 dark:border-green-800 p-6 md:p-8 hover:shadow-lg transition-all">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-green-200 dark:bg-green-900/30 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-300">
                  Income
                </span>
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-green-700 dark:text-green-300">
                ${totalIncome.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                {transactions.filter((t) => t.type === "income").length} transactions
              </p>
            </div>
          </div>

          {/* Expense Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 border border-red-200 dark:border-red-800 p-6 md:p-8 hover:shadow-lg transition-all">
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-red-200 dark:bg-red-900/30 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-red-700 dark:text-red-300">
                  Expenses
                </span>
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-red-700 dark:text-red-300">
                ${totalExpense.toFixed(2)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                {transactions.filter((t) => t.type === "expense").length} transactions
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/30 dark:to-accent/30 border border-primary/50 dark:border-primary/50 p-6 md:p-8 hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
                  Balance
                </span>
                <Wallet className="w-5 h-5 text-primary dark:text-accent" />
              </div>
              <p
                className={`text-4xl md:text-5xl font-black ${balance >= 0 ? "text-primary dark:text-accent" : "text-red-600 dark:text-red-400"}`}
              >
                ${balance.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Net position</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <div className="border-b border-border">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent border-b-2 border-accent/20 rounded-none p-0">
              <TabsTrigger
                value="transactions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-semibold text-sm"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="add-transaction"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-semibold text-sm"
              >
                Add
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-semibold text-sm"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-semibold text-sm"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="export"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-semibold text-sm"
              >
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions" className="mt-8">
            <TransactionList />
          </TabsContent>

          <TabsContent value="add-transaction" className="mt-8">
            <div className="max-w-2xl">
              <TransactionForm />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-8">
            <FinanceCharts />
          </TabsContent>

          <TabsContent value="categories" className="mt-8">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="export" className="mt-8">
            <ExportSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
