import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CryptoCurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation?: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply?: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi?: {
    times: number
    currency: string
    percentage: number
  }
  last_updated: string
}

export interface GlobalStats {
  total_market_cap: { usd: number }
  total_volume: { usd: number }
  market_cap_percentage: { btc: number }
  active_cryptocurrencies: number
}

export interface ChartData {
  prices: [number, number][]
}

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['Crypto', 'Global'],
  endpoints: (builder) => ({
    getCryptocurrencies: builder.query<CryptoCurrency[], { page?: number; search?: string; sortBy?: string }>({
      query: ({ page = 1, search = '', sortBy = 'market_cap_desc' }) => 
        `cryptocurrencies?page=${page}&search=${search}&sortBy=${sortBy}`,
      providesTags: ['Crypto'],
    }),
    getGlobalStats: builder.query<GlobalStats, void>({
      query: () => 'global',
      providesTags: ['Global'],
    }),
    getCoinChart: builder.query<ChartData, { coinId: string; days: number }>({
      query: ({ coinId, days }) => `chart/${coinId}?days=${days}`,
    }),
    getCoinDetails: builder.query<CryptoCurrency, string>({
      query: (coinId) => `coin/${coinId}`,
    }),
  }),
})

export const {
  useGetCryptocurrenciesQuery,
  useGetGlobalStatsQuery,
  useGetCoinChartQuery,
  useGetCoinDetailsQuery,
} = cryptoApi