'use client'

import { useState } from 'react'
import { X, ExternalLink, Star, Share2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CryptoCurrency, useGetCoinChartQuery } from '@/lib/services/cryptoApi'
import PriceChart from './PriceChart'

interface CoinDetailModalProps {
  coin: CryptoCurrency
  isOpen: boolean
  onClose: () => void
}

export default function CoinDetailModal({ coin, isOpen, onClose }: CoinDetailModalProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(7)
  
  const { data: chartData, isLoading: chartLoading } = useGetCoinChartQuery({
    coinId: coin.id,
    days: selectedTimeframe
  })

  const timeframes = [
    { label: '1D', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 },
  ]

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-0">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">{coin.name}</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Price Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(coin.current_price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">24h Change</p>
              <p className={`text-2xl font-bold ${
                coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Cap</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(coin.market_cap)}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Chart</h3>
              <div className="flex space-x-1">
                {timeframes.map(({ label, days }) => (
                  <Button
                    key={days}
                    variant={selectedTimeframe === days ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(days)}
                    className="px-3 py-1 text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <PriceChart 
                data={chartData?.prices || []} 
                loading={chartLoading}
                timeframe={selectedTimeframe}
              />
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rank</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                #{coin.market_cap_rank}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Volume 24h</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(coin.total_volume)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">High 24h</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(coin.high_24h)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Low 24h</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(coin.low_24h)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600">
              <Star className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on CoinGecko
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}