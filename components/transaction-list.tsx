"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransactions } from "@/context/transaction-context"
import { Trash2 } from "lucide-react"

type SortBy = "date-desc" | "date-asc" | "amount-desc" | "amount-asc"

export default function TransactionList() {
  const { transactions, deleteTransaction, categories } = useTransactions()
  const [searchText, setSearchText] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortBy>("date-desc")

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType)
    }

    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory)
    }

    if (searchText) {
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(searchText.toLowerCase()) ||
          (t.notes?.toLowerCase().includes(searchText.toLowerCase()) ?? false),
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        default:
          return 0
      }
    })

    return result
  }, [transactions, filterType, filterCategory, searchText, sortBy])

  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category))).sort()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Search</label>
          <Input
            placeholder="Find transactions..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Type</label>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as "all" | "income" | "expense")}>
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Category
          </label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl font-bold text-muted-foreground">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-2">Start tracking by adding your first transaction</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                transaction.type === "income"
                  ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="font-bold text-foreground">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                {transaction.notes && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">{transaction.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-4 ml-4">
                <p
                  className={`font-black text-lg ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "−"}${transaction.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="text-xl font-black text-foreground">{filteredTransactions.length}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/40">
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">Income</p>
            <p className="text-xl font-black text-green-600 dark:text-green-400">
              $
              {filteredTransactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/40">
            <p className="text-xs font-bold uppercase tracking-widest text-red-700 dark:text-red-400">Expenses</p>
            <p className="text-xl font-black text-red-600 dark:text-red-400">
              $
              {filteredTransactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
