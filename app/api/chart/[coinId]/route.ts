import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export async function GET(
  request: NextRequest,
  { params }: { params: { coinId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = searchParams.get('days') || '7'
    
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${params.coinId}/market_chart?vs_currency=usd&days=${days}`
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    )
  }
}