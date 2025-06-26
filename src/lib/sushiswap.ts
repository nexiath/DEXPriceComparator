import { Token } from './tokens'

export interface SushiPriceResult {
  price: string
  inverted: string
  source: 'sushiswap'
}

// SushiSwap Legacy API endpoints
const SUSHI_API_BASE = 'https://7ob2ikxqn7.execute-api.us-east-1.amazonaws.com/dev'

interface SushiTickerResponse {
  [pairId: string]: {
    base_id: string
    base_name: string
    base_symbol: string
    quote_id: string
    quote_name: string
    quote_symbol: string
    last_price: string
    base_volume: string
    quote_volume: string
  }
}


function createPairId(tokenA: Token, tokenB: Token): string {
  // Handle ETH address conversion to WETH
  const addressA = tokenA.address === '0x0000000000000000000000000000000000000000' 
    ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' 
    : tokenA.address
  const addressB = tokenB.address === '0x0000000000000000000000000000000000000000'
    ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    : tokenB.address

  // SushiSwap pair ID format: token0_token1 (alphabetically sorted)
  const sortedAddresses = [addressA.toLowerCase(), addressB.toLowerCase()].sort()
  return `${sortedAddresses[0]}_${sortedAddresses[1]}`
}

export async function getSushiPrice(
  tokenIn: Token,
  tokenOut: Token
): Promise<SushiPriceResult | null> {
  try {
    // Get all tickers data
    const tickersResponse = await fetch(`${SUSHI_API_BASE}/swap/tickers`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!tickersResponse.ok) {
      throw new Error(`SushiSwap API error: ${tickersResponse.status}`)
    }

    const tickers: SushiTickerResponse = await tickersResponse.json()
    
    // Create pair ID for the token pair
    const pairId = createPairId(tokenIn, tokenOut)
    
    // Find the pair in tickers
    const pairData = tickers[pairId]
    
    if (!pairData) {
      throw new Error('Pair not found in SushiSwap')
    }

    // Determine which token is base and which is quote
    const inputAddress = tokenIn.address === '0x0000000000000000000000000000000000000000'
      ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase()
      : tokenIn.address.toLowerCase()
    
    const baseAddress = pairData.base_id.toLowerCase()
    const price = parseFloat(pairData.last_price)
    
    let finalPrice: number
    let invertedPrice: number

    if (inputAddress === baseAddress) {
      // Input token is base, output token is quote
      finalPrice = price
      invertedPrice = 1 / price
    } else {
      // Input token is quote, output token is base
      finalPrice = 1 / price
      invertedPrice = price
    }

    return {
      price: finalPrice.toString(),
      inverted: invertedPrice.toString(),
      source: 'sushiswap'
    }
  } catch (error) {
    console.error('Error fetching SushiSwap price:', error)
    return null
  }
}

export function calculatePriceDifference(uniPrice: string, sushiPrice: string): {
  difference: number
  percentage: string
  better: 'uniswap' | 'sushiswap' | 'equal'
} {
  const uni = parseFloat(uniPrice)
  const sushi = parseFloat(sushiPrice)
  
  if (isNaN(uni) || isNaN(sushi)) {
    return {
      difference: 0,
      percentage: '0%',
      better: 'equal'
    }
  }

  const difference = ((sushi - uni) / uni) * 100
  
  return {
    difference,
    percentage: `${Math.abs(difference).toFixed(2)}%`,
    better: difference > 0 ? 'sushiswap' : difference < 0 ? 'uniswap' : 'equal'
  }
}