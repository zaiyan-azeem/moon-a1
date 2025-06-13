// src/components/ChartCard.tsx
import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

const COLORS = [
  "#6366f1", // indigo-500
  "#f59e42", // orange-400
  "#10b981", // emerald-500
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#a21caf", // purple-700
]

interface ChartCardProps {
  title: string
  subtitle?: string
  data: any[]
  xKey: string
  yKey?: string
  chartType: "line" | "bar" | "multi-line"
  multiLineKeys?: string[]
}

export function ChartCard({
  title,
  subtitle,
  data,
  xKey,
  yKey = "",
  chartType,
  multiLineKeys = [],
}: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-zinc-500 dark:text-zinc-300">{subtitle}</p>
        )}
      </div>

      {/* Chart Container */}
      <div className="w-full h-48 sm:h-64">
        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={yKey} fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "multi-line" && multiLineKeys.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {multiLineKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
