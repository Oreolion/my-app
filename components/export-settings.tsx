"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTransactions } from "@/context/transaction-context"
import { Download, Trash2 } from "lucide-react"

export default function ExportSettings() {
  const { transactions, categories } = useTransactions()
  const [exporting, setExporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const exportToCSV = () => {
    setExporting(true)

    try {
      // Prepare CSV headers
      const headers = ["Date", "Type", "Category", "Amount", "Notes"]

      // Prepare CSV rows
      const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.amount.toFixed(2),
        t.notes ? `"${t.notes.replace(/"/g, '""')}"` : "", // Escape quotes in notes
      ])

      // Create CSV content
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `finance-tracker-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExporting(false)
    } catch (error) {
      console.error("Failed to export CSV:", error)
      alert("Failed to export CSV")
      setExporting(false)
    }
  }

  const exportAllAsJSON = () => {
    setExporting(true)

    try {
      const data = {
        exportDate: new Date().toISOString(),
        transactions,
        categories,
      }

      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `finance-tracker-backup-${new Date().toISOString().split("T")[0]}.json`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExporting(false)
    } catch (error) {
      console.error("Failed to export JSON:", error)
      alert("Failed to export JSON")
      setExporting(false)
    }
  }

  const clearAllData = () => {
    localStorage.removeItem("transactions")
    localStorage.removeItem("categories")
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Export Data</h3>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-2">Export as CSV</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Download your transactions as a CSV file for use in spreadsheet applications.
            </p>
            <Button
              onClick={exportToCSV}
              disabled={exporting || transactions.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-2">Export as JSON (Backup)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Download a complete backup of your data including transactions and categories.
            </p>
            <Button
              onClick={exportAllAsJSON}
              disabled={exporting || transactions.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? "Exporting..." : "Export Backup"}
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          These actions cannot be undone. Please proceed with caution.
        </p>

        {!showDeleteConfirm ? (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              Are you sure you want to delete all data? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button onClick={clearAllData} className="bg-red-600 hover:bg-red-700 text-white font-medium">
                Yes, Delete Everything
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-slate-600 hover:bg-slate-700 text-white font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Data Summary */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Transactions</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{transactions.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{categories.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Storage Used</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {Math.round((JSON.stringify({ transactions, categories }).length / 1024) * 10) / 10} KB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
