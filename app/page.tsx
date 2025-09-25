'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, BarChart3, Activity } from 'lucide-react'
import Header from '@/components/Header'
import StatCard from '@/components/StatCard'
import CryptoTable from '@/components/CryptoTable'
import QuickActions from '@/components/QuickActions'
import { Badge } from '@/components/ui/badge'
import { useGetCryptocurrenciesQuery, useGetGlobalStatsQuery } from '@/lib/services/cryptoApi'
import { useAppSelector } from '@/lib/hooks'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('market_cap_desc')
  const isDark = useAppSelector((state) => state.theme.isDark)

  const { 
    data: cryptos, 
    isLoading: cryptosLoading, 
    refetch: refetchCryptos 
  } = useGetCryptocurrenciesQuery({ 
    search: searchQuery, 
    sortBy 
  })

  const { 
    data: globalStats, 
    isLoading: globalLoading 
  } = useGetGlobalStatsQuery()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCryptos()
    }, 60000)

    return () => clearInterval(interval)
  }, [refetchCryptos])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = () => {
    refetchCryptos()
  }

  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num?.toFixed(2) || '0.00'}`
  }

  const vanryCoin = cryptos?.find(coin => coin.symbol.toLowerCase() === 'vanry')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cryptocurrency Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track top 100 cryptocurrencies with real-time market data
          </p>
        </div>

        {/* Featured Trading Pair */}
        {vanryCoin && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Featured Trading Pair</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              VANRY/USDT is prominently featured as our primary trading pair
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Market Cap"
            value={globalLoading ? '...' : formatNumber(globalStats?.total_market_cap.usd || 0)}
            change="+2.34%"
            positive={true}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatCard
            title="24h Volume"
            value={globalLoading ? '...' : formatNumber(globalStats?.total_volume.usd || 0)}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <StatCard
            title="BTC Dominance"
            value={globalLoading ? '...' : `${globalStats?.market_cap_percentage.btc?.toFixed(1) || '0.0'}%`}
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatCard
            title="Active Cryptocurrencies"
            value={globalLoading ? '...' : (globalStats?.active_cryptocurrencies?.toLocaleString() || '0')}
            icon={<Activity className="h-6 w-6" />}
          />
        </div>

        {/* Crypto Table */}
        <CryptoTable 
          data={cryptos || []}
          isLoading={cryptosLoading}
          onRefresh={handleRefresh}
          onSort={handleSort}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Footer */}
        <footer className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CV</span>
            </div>
            <span className="text-sm">CryptoView</span>
            <span className="text-sm">© 2025 CryptoView. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </div>
  )
}