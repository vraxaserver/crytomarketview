import { NextResponse } from 'next/server'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export async function GET() {
  try {
    const response = await fetch(`${COINGECKO_API_BASE}/global`)
    
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data.data)
  } catch (error) {
    console.error('Error fetching global stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch global statistics' },
      { status: 500 }
    )
  }
}