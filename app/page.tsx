"use client"

import { useEffect, useState } from "react"
import Dashboard from "../components/dashboard"
import { TransactionProvider } from "../context/transaction-context"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  )
}
