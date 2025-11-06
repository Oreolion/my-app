"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/context/transaction-context"

export default function FinanceCharts() {
  const { transactions } = useTransactions()

  // Summary data for income vs expense
  const summaryData = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    return [
      { name: "Income", value: totalIncome, fill: "#22c55e" },
      { name: "Expense", value: totalExpense, fill: "#ef4444" },
    ]
  }, [transactions])

  // Category breakdown
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { income: number; expense: number }>()

    transactions.forEach((t) => {
      const current = categoryMap.get(t.category) || { income: 0, expense: 0 }
      if (t.type === "income") {
        current.income += t.amount
      } else {
        current.expense += t.amount
      }
      categoryMap.set(t.category, current)
    })

    return Array.from(categoryMap.entries()).map(([name, values]) => ({
      name,
      income: values.income,
      expense: values.expense,
    }))
  }, [transactions])

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>()

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      const current = monthMap.get(monthKey) || { income: 0, expense: 0 }
      if (t.type === "income") {
        current.income += t.amount
      } else {
        current.expense += t.amount
      }
      monthMap.set(monthKey, current)
    })

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        income: values.income,
        expense: values.expense,
      }))
  }, [transactions])

  // Expense breakdown pie chart
  const expensePieData = useMemo(() => {
    const categoryMap = new Map<string, number>()

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + t.amount)
      })

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))
  }, [transactions])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"]

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">
          No transactions yet. Add some transactions to see analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaryData.map((item) => (
          <Card
            key={item.name}
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="flex items-center gap-4 p-6">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.fill }}
              />
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total {item.name}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">${item.value.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Income vs Expense Pie Chart */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Income vs Expense Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={summaryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {summaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Expense Distribution Pie Chart */}
      {expensePieData.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expensePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
