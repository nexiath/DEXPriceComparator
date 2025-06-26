import { Token } from './tokens'

export interface SushiPriceResult {
  price: string
  inverted: string
  source: 'sushiswap'
}

// Mock SushiSwap price for demo - replace with working API
export async function getSushiPrice(
  tokenIn: Token,
  tokenOut: Token
): Promise<SushiPriceResult | null> {
  try {
    // For demo purposes, simulate SushiSwap prices with slight variation from mock data
    const mockPrices: Record<string, number> = {
      'USDC-ETH': 0.0003,
      'ETH-USDC': 3333.33,
      'DAI-ETH': 0.0003,
      'ETH-DAI': 3333.33,
      'WETH-USDC': 3333.33,
      'USDC-WETH': 0.0003,
      'WBTC-ETH': 15.5,
      'ETH-WBTC': 0.065,
      'UNI-ETH': 0.003,
      'ETH-UNI': 333.33,
      'LINK-ETH': 0.007,
      'ETH-LINK': 142.86
    }

    const pairKey = `${tokenIn.symbol}-${tokenOut.symbol}`
    const reversePairKey = `${tokenOut.symbol}-${tokenIn.symbol}`
    
    let price = mockPrices[pairKey]
    if (!price && mockPrices[reversePairKey]) {
      price = 1 / mockPrices[reversePairKey]
    }
    
    if (!price) {
      // Default fallback for unknown pairs
      price = 1
    }

    // Add slight variation to simulate real market differences from Uniswap
    const variation = 0.95 + Math.random() * 0.1 // 95% to 105% of base price
    const finalPrice = price * variation
    const invertedPrice = 1 / finalPrice

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