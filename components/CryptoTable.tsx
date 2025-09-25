'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronUp, ChevronDown, MoreHorizontal, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CryptoCurrency } from '@/lib/services/cryptoApi'
import CoinDetailModal from './CoinDetailModal'

interface CryptoTableProps {
  data: CryptoCurrency[]
  isLoading: boolean
  onRefresh: () => void
  onSort: (sortBy: string) => void
}

export default function CryptoTable({ data, isLoading, onRefresh, onSort }: CryptoTableProps) {
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null)
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' })

  const handleSort = (key: string) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    
    const sortBy = key === 'market_cap_rank' ? 'market_cap_desc' : 
                   key === 'current_price' ? 'price_desc' : 
                   key === 'price_change_percentage_24h' ? 'change_desc' : 
                   'market_cap_desc'
    onSort(direction === 'desc' ? sortBy : sortBy.replace('_desc', '_asc'))
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num?.toFixed(2) || '0.00'}`
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`
    if (price < 1) return `$${price.toFixed(4)}`
    return `$${price.toFixed(2)}`
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <MoreHorizontal className="h-4 w-4 opacity-50" />
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cryptocurrencies</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th 
                  className="text-left p-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('market_cap_rank')}
                >
                  <div className="flex items-center space-x-1">
                    <span># Rank</span>
                    <SortIcon column="market_cap_rank" />
                  </div>
                </th>
                <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th 
                  className="text-right p-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('current_price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Price</span>
                    <SortIcon column="current_price" />
                  </div>
                </th>
                <th 
                  className="text-right p-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('price_change_percentage_24h')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>24h %</span>
                    <SortIcon column="price_change_percentage_24h" />
                  </div>
                </th>
                <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Market Cap</th>
                <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Volume</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-50 dark:border-gray-700/50">
                    <td className="p-4">
                      <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : (
                data?.map((coin) => (
                  <tr 
                    key={coin.id}
                    className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCoin(coin)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {coin.market_cap_rank}
                        </span>
                        {coin.symbol.toLowerCase() === 'vanry' && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{coin.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(coin.current_price)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-medium ${
                        coin.price_change_percentage_24h >= 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-gray-600 dark:text-gray-300">
                        {formatNumber(coin.market_cap)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-gray-600 dark:text-gray-300">
                        {formatNumber(coin.total_volume)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCoin && (
        <CoinDetailModal
          coin={selectedCoin}
          isOpen={!!selectedCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </>
  )
}