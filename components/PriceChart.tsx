'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface PriceChartProps {
  data: [number, number][]
  loading: boolean
  timeframe: number
}

export default function PriceChart({ data, loading, timeframe }: PriceChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    )
  }

  const chartData = data.map(([timestamp, price]) => ({
    time: timestamp,
    price: price,
    date: new Date(timestamp).toLocaleDateString(),
  }))

  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp)
    if (timeframe === 1) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } else if (timeframe <= 30) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' })
    }
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`
    if (price < 1) return `$${price.toFixed(4)}`
    return `$${price.toFixed(2)}`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis 
          dataKey="time"
          tickFormatter={formatXAxisLabel}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
        />
        <YAxis 
          domain={['dataMin - dataMin * 0.01', 'dataMax + dataMax * 0.01']}
          tickFormatter={formatPrice}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(label).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Price: {formatPrice(payload[0].value as number)}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}