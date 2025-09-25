interface StatCardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  positive?: boolean
}

export default function StatCard({ title, value, change, icon, positive }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  )
}