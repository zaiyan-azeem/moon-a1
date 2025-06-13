import React from "react"

interface SummaryCardProps {
  title: string
  value: React.ReactNode
  description?: string
}

export function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 flex flex-col gap-1 min-w-[140px]">
      <div className="text-xs text-zinc-500 dark:text-zinc-300 font-medium">{title}</div>
      <div className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</div>
      {description && <div className="text-xs text-green-600 dark:text-green-400">{description}</div>}
    </div>
  )
}
