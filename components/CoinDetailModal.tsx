'use client'

import { useState } from 'react'
import { X, ExternalLink, Star, Share2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 p-0 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
            <div>
              <DialogTitle className="text-lg font-semibold text-white">{coin.name}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 uppercase font-medium">{coin.symbol}</DialogDescription>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">Current Price</p>
              <p className="text-2xl font-bold text-white">
                {formatPrice(coin.current_price)}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">24h Change</p>
              <p className={`text-2xl font-bold ${
                coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">Market Cap</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(coin.market_cap)}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Price Chart</h3>
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                {timeframes.map(({ label, days }) => (
                  <button
                    key={days}
                    onClick={() => setSelectedTimeframe(days)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedTimeframe === days
                        ? 'bg-slate-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80 bg-slate-700/30 rounded-lg">
              <PriceChart 
                data={chartData?.prices || []} 
                loading={chartLoading}
                timeframe={selectedTimeframe}
              />
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">Rank</p>
              <p className="text-xl font-bold text-white">
                #{coin.market_cap_rank}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">Volume 24h</p>
              <p className="text-xl font-bold text-white">
                {formatNumber(coin.total_volume)}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">High 24h</p>
              <p className="text-xl font-bold text-white">
                {formatPrice(coin.high_24h)}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400 mb-2">Low 24h</p>
              <p className="text-xl font-bold text-white">
                {formatPrice(coin.low_24h)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <Button className="bg-white text-slate-800 hover:bg-slate-100 font-medium py-3">
              <Star className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-600 text-white hover:bg-slate-700 font-medium py-3"
              onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on CoinGecko
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-600 text-white hover:bg-slate-700 font-medium py-3"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}