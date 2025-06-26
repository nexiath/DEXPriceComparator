import { Token } from './tokens'

export interface PriceResult {
  price: string
  inverted: string
  pool: string
  fee: number
}

// Mock Uniswap price for demo - replace with working SDK calls
export async function getUniswapPrice(
  tokenIn: Token, 
  tokenOut: Token
): Promise<PriceResult | null> {
  try {
    // For demo purposes, simulate Uniswap prices
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

    const invertedPrice = 1 / price

    return {
      price: price.toString(),
      inverted: invertedPrice.toString(),
      pool: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', // USDC/ETH pool example
      fee: 500 // 0.05%
    }
  } catch (error) {
    console.error('Error fetching Uniswap price:', error)
    return null
  }
}

export function formatPrice(price: string, tokenSymbol: string): string {
  const num = parseFloat(price)
  if (num < 0.0001) {
    return `< 0.0001 ${tokenSymbol}`
  }
  if (num < 1) {
    return `${num.toFixed(6)} ${tokenSymbol}`
  }
  if (num < 1000) {
    return `${num.toFixed(4)} ${tokenSymbol}`
  }
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${tokenSymbol}`
}