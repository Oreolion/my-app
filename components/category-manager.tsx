"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTransactions } from "@/context/transaction-context"
import { Trash2, Plus } from "lucide-react"
import { Select } from "./ui/select"

export default function CategoryManager() {
  const { categories, addCategory, deleteCategory, transactions } = useTransactions()
  const [newCategory, setNewCategory] = useState("")
  const [categoryType, setCategoryType] = useState<"income" | "expense">("expense")
  const [added, setAdded] = useState(false)

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategory.trim()) {
      alert("Please enter a category name")
      return
    }

    // Check if category already exists
    if (categories.some((c) => c.name.toLowerCase() === newCategory.toLowerCase())) {
      alert("This category already exists")
      return
    }

    addCategory({
      name: newCategory,
      type: categoryType,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setNewCategory("")
  }

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  const getCategoryTransactionCount = (categoryName: string): number => {
    return transactions.filter((t) => t.category === categoryName).length
  }

  return (
    <div className="space-y-6">
      {added && (
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
          Category added successfully!
        </div>
      )}

      {/* Add New Category Form */}
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <Select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value as "income" | "expense")}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>
      </div>

      {/* Income Categories */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Income Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeCategories.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 col-span-full">No income categories</p>
          ) : (
            incomeCategories.map((cat) => {
              const count = getCategoryTransactionCount(cat.name)
              return (
                <div
                  key={cat.id}
                  className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">{cat.name}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {count} transaction{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    disabled={count > 0}
                    className={`p-2 rounded-lg transition-colors ${
                      count > 0
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : "hover:bg-green-200 dark:hover:bg-green-800 text-green-600 dark:text-green-400"
                    }`}
                    title={count > 0 ? "Cannot delete: category has transactions" : "Delete category"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Expense Categories */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Expense Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 col-span-full">No expense categories</p>
          ) : (
            expenseCategories.map((cat) => {
              const count = getCategoryTransactionCount(cat.name)
              return (
                <div
                  key={cat.id}
                  className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">{cat.name}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {count} transaction{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    disabled={count > 0}
                    className={`p-2 rounded-lg transition-colors ${
                      count > 0
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : "hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
                    }`}
                    title={count > 0 ? "Cannot delete: category has transactions" : "Delete category"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
