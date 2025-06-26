'use client'

import { useState, useEffect } from 'react'
import { Token } from '@/lib/tokens'
import { getUniswapPrice, formatPrice, type PriceResult } from '@/lib/uniswap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, ExternalLink } from 'lucide-react'
import { useAccount } from 'wagmi'

interface PriceDisplayProps {
  tokenA: Token
  tokenB: Token
}

export function PriceDisplay({ tokenA, tokenB }: PriceDisplayProps) {
  const [priceData, setPriceData] = useState<PriceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { chain } = useAccount()

  useEffect(() => {
    const fetchPrice = async () => {
      if (!tokenA || !tokenB) return

      setLoading(true)
      setError(null)

      try {
        const chainId = chain?.id || 1 // Default to Ethereum mainnet
        const result = await getUniswapPrice(tokenA, tokenB, chainId)
        
        if (result) {
          setPriceData(result)
        } else {
          setError('No active pool found for this pair')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price')
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Uniswap Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Fetching price...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Uniswap Price
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

  if (!priceData) {
    return null
  }

  return (
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
              {formatPrice(priceData.price, tokenB.symbol)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1 {tokenB.symbol} =
            </p>
            <p className="text-2xl font-bold">
              {formatPrice(priceData.inverted, tokenA.symbol)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Fee: {getFeeLabel(priceData.fee)}
            </Badge>
            <Badge variant="outline">
              Uniswap V3
            </Badge>
          </div>
          
          <a
            href={`https://etherscan.io/address/${priceData.pool}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Pool <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}