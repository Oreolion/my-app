"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransactions } from "@/context/transaction-context"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function TransactionForm() {
  const { addTransaction, categories } = useTransactions()
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const [submitted, setSubmitted] = useState<"success" | "error" | null>(null)
  const [error, setError] = useState("")

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedAmount = formData.amount.trim()
    const amount = Number.parseFloat(trimmedAmount)

    if (!trimmedAmount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0")
      setSubmitted("error")
      setTimeout(() => setSubmitted(null), 3000)
      return
    }

    if (!formData.category) {
      setError("Please select a category")
      setSubmitted("error")
      setTimeout(() => setSubmitted(null), 3000)
      return
    }

    addTransaction({
      type: formData.type,
      amount: amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
    })

    setSubmitted("success")
    setTimeout(() => setSubmitted(null), 3000)

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted === "success" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">Success!</p>
            <p className="text-sm text-green-800 dark:text-green-400">Transaction recorded</p>
          </div>
        </div>
      )}

      {submitted === "error" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-300">Oops!</p>
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Type Selection */}
      <div className="grid grid-cols-2 gap-4">
        <label className="relative cursor-pointer group">
          <input
            type="radio"
            value="income"
            checked={formData.type === "income"}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense", category: "" })}
            className="sr-only"
          />
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.type === "income"
                ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                : "border-border bg-muted"
            }`}
          >
            <span className="font-bold text-lg">💰 Income</span>
          </div>
        </label>
        <label className="relative cursor-pointer group">
          <input
            type="radio"
            value="expense"
            checked={formData.type === "expense"}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense", category: "" })}
            className="sr-only"
          />
          <div
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.type === "expense" ? "border-red-500 bg-red-50 dark:bg-red-950/40" : "border-border bg-muted"
            }`}
          >
            <span className="font-bold text-lg">📊 Expense</span>
          </div>
        </label>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Amount</label>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="Enter amount (e.g., 50.00)"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="text-lg font-bold"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Category</label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="text-base">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Date</label>
        <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Notes (Optional)
        </label>
        <Textarea
          placeholder="Add details..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="resize-none"
          rows={3}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl"
      >
        Record Transaction
      </Button>
    </form>
  )
}
