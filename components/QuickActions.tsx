import { Search, TrendingUp, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
          <Search className="h-4 w-4" />
          <span>Advanced Search</span>
        </Button>
        <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
          <TrendingUp className="h-4 w-4" />
          <span>Market Analysis</span>
        </Button>
        <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
          <Eye className="h-4 w-4" />
          <span>View VANRY Details</span>
        </Button>
      </div>
    </div>
  )
}