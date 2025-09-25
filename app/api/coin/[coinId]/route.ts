import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export async function GET(
  request: NextRequest,
  { params }: { params: { coinId: string } }
) {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${params.coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching coin details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coin details' },
      { status: 500 }
    )
  }
}