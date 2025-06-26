import { Token as UniToken } from '@uniswap/sdk-core'
import { Pool, FeeAmount, computePoolAddress } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import { Token } from './tokens'

// Uniswap V3 Factory address (same on mainnet and most testnets)
const UNISWAP_V3_FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

// Pool ABI for getting slot0 data
const POOL_ABI = [
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() external view returns (uint128)',
]

// RPC endpoints
const RPC_URLS = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
  11155111: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://eth-sepolia.public.blastapi.io',
}

export interface PriceResult {
  price: string
  inverted: string
  pool: string
  fee: number
}

function createUniToken(token: Token, chainId: number): UniToken {
  return new UniToken(
    chainId,
    token.address === '0x0000000000000000000000000000000000000000' 
      ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // Use WETH for ETH
      : token.address,
    token.decimals,
    token.symbol === 'ETH' ? 'WETH' : token.symbol,
    token.name
  )
}

export async function getUniswapPrice(
  tokenIn: Token, 
  tokenOut: Token, 
  chainId: number = 1
): Promise<PriceResult | null> {
  try {
    const rpcUrl = RPC_URLS[chainId as keyof typeof RPC_URLS]
    if (!rpcUrl) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    
    const token0 = createUniToken(tokenIn, chainId)
    const token1 = createUniToken(tokenOut, chainId)

    // Try different fee tiers
    const feeTiers = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH]
    
    for (const fee of feeTiers) {
      try {
        const poolAddress = computePoolAddress({
          factoryAddress: UNISWAP_V3_FACTORY,
          tokenA: token0,
          tokenB: token1,
          fee,
        })

        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
        
        // Check if pool exists by trying to get slot0
        const [slot0, liquidity] = await Promise.all([
          poolContract.slot0(),
          poolContract.liquidity()
        ])

        // Skip pools with no liquidity
        if (liquidity.toString() === '0') {
          continue
        }

        const pool = new Pool(
          token0,
          token1,
          fee,
          slot0.sqrtPriceX96.toString(),
          liquidity.toString(),
          slot0.tick
        )

        // Get price of token0 in terms of token1
        const price = pool.token0Price
        const invertedPrice = pool.token1Price

        return {
          price: price.toSignificant(6),
          inverted: invertedPrice.toSignificant(6),
          pool: poolAddress,
          fee: fee
        }
      } catch {
        // Continue to next fee tier if this one fails
        continue
      }
    }

    throw new Error('No active pool found for this token pair')
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