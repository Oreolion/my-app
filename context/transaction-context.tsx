"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  notes?: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
}

interface TransactionContextType {
  transactions: Transaction[]
  categories: Category[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void
  addCategory: (category: Omit<Category, "id">) => void
  deleteCategory: (id: string) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Salary", type: "income" },
  { id: "2", name: "Freelance", type: "income" },
  { id: "3", name: "Investments", type: "income" },
  { id: "4", name: "Food & Dining", type: "expense" },
  { id: "5", name: "Transportation", type: "expense" },
  { id: "6", name: "Utilities", type: "expense" },
  { id: "7", name: "Entertainment", type: "expense" },
  { id: "8", name: "Shopping", type: "expense" },
]

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    const savedCategories = localStorage.getItem("categories")

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (e) {
        console.error("Failed to parse transactions:", e)
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (e) {
        console.error("Failed to parse categories:", e)
      }
    } else {
      setCategories(DEFAULT_CATEGORIES)
    }

    setHydrated(true)
  }, [])

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    }
  }, [transactions, hydrated])

  // Save to localStorage whenever categories change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("categories", JSON.stringify(categories))
    }
  }, [categories, hydrated])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setTransactions([...transactions, { ...transaction, id }])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const updateTransaction = (id: string, transaction: Omit<Transaction, "id">) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...transaction, id } : t)))
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setCategories([...categories, { ...category, id }])
  }

  const deleteCategory = (id: string) => {
    // Don't delete if there are transactions using this category
    const hasTransactions = transactions.some((t) => categories.find((c) => c.id === id && c.name === t.category))
    if (!hasTransactions) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider")
  }
  return context
}
