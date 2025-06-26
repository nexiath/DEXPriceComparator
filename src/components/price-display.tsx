'use client'

import { useState, useEffect } from 'react'
import { Token } from '@/lib/tokens'
import { getUniswapPrice, formatPrice, type PriceResult } from '@/lib/uniswap'
import { getSushiPrice, calculatePriceDifference, type SushiPriceResult } from '@/lib/sushiswap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, ExternalLink, ArrowUpDown } from 'lucide-react'
import { useAccount } from 'wagmi'

interface PriceDisplayProps {
  tokenA: Token
  tokenB: Token
}

export function PriceDisplay({ tokenA, tokenB }: PriceDisplayProps) {
  const [uniswapData, setUniswapData] = useState<PriceResult | null>(null)
  const [sushiData, setSushiData] = useState<SushiPriceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { chain } = useAccount()

  useEffect(() => {
    const fetchPrices = async () => {
      if (!tokenA || !tokenB) return

      setLoading(true)
      setError(null)

      try {
        const chainId = chain?.id || 1 // Default to Ethereum mainnet
        
        // Fetch both prices in parallel
        const [uniResult, sushiResult] = await Promise.all([
          getUniswapPrice(tokenA, tokenB, chainId),
          getSushiPrice(tokenA, tokenB)
        ])
        
        if (uniResult) {
          setUniswapData(uniResult)
        }
        
        if (sushiResult) {
          setSushiData(sushiResult)
        }

        if (!uniResult && !sushiResult) {
          setError('No active pools found for this pair on any DEX')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [tokenA, tokenB, chain])

  const getFeeLabel = (fee: number) => {
    switch (fee) {
      case 100: return '0.01%'
      case 500: return '0.05%'
      case 3000: return '0.3%'
      case 10000: return '1%'
      default: return `${fee / 10000}%`
    }
  }

  const priceDiff = uniswapData && sushiData 
    ? calculatePriceDifference(uniswapData.price, sushiData.price)
    : null

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            DEX Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Fetching prices...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !uniswapData && !sushiData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            DEX Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Price Comparison */}
      {priceDiff && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Price Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">
                {priceDiff.percentage} difference
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge 
                  variant={priceDiff.better === 'uniswap' ? 'default' : 'secondary'}
                  className={priceDiff.better === 'uniswap' ? 'bg-green-500' : ''}
                >
                  Uniswap {priceDiff.better === 'uniswap' ? '✓ Better' : ''}
                </Badge>
                <span className="text-muted-foreground">vs</span>
                <Badge 
                  variant={priceDiff.better === 'sushiswap' ? 'default' : 'secondary'}
                  className={priceDiff.better === 'sushiswap' ? 'bg-green-500' : ''}
                >
                  SushiSwap {priceDiff.better === 'sushiswap' ? '✓ Better' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uniswap Price */}
      {uniswapData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Uniswap V3 Price
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1 {tokenA.symbol} =
                </p>
                <p className="text-2xl font-bold">
                  {formatPrice(uniswapData.price, tokenB.symbol)}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1 {tokenB.symbol} =
                </p>
                <p className="text-2xl font-bold">
                  {formatPrice(uniswapData.inverted, tokenA.symbol)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Fee: {getFeeLabel(uniswapData.fee)}
                </Badge>
                <Badge variant="outline">
                  Uniswap V3
                </Badge>
              </div>
              
              <a
                href={`https://etherscan.io/address/${uniswapData.pool}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Pool <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SushiSwap Price */}
      {sushiData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              SushiSwap Price
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1 {tokenA.symbol} =
                </p>
                <p className="text-2xl font-bold">
                  {formatPrice(sushiData.price, tokenB.symbol)}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  1 {tokenB.symbol} =
                </p>
                <p className="text-2xl font-bold">
                  {formatPrice(sushiData.inverted, tokenA.symbol)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  SushiSwap V2
                </Badge>
              </div>
              
              <a
                href="https://www.sushi.com/swap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Trade <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error states for individual DEXs */}
      {!uniswapData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Uniswap V3 Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p>No Uniswap pool found for this pair</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!sushiData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              SushiSwap Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p>No SushiSwap pool found for this pair</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}