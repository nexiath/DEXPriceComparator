'use client'

import { useState } from 'react'
import { TokenSelector } from './token-selector'
import { PriceDisplay } from './price-display'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { type Token, getTokenBySymbol } from '@/lib/tokens'

export function TokenSelection() {
  const [tokenA, setTokenA] = useState<Token | undefined>(getTokenBySymbol('USDC'))
  const [tokenB, setTokenB] = useState<Token | undefined>(getTokenBySymbol('ETH'))

  const handleSwapTokens = () => {
    const temp = tokenA
    setTokenA(tokenB)
    setTokenB(temp)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Select Tokens to Compare
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenSelector
              label="Token A"
              selectedToken={tokenA}
              onTokenSelect={setTokenA}
              placeholder="Select first token"
            />
            
            <TokenSelector
              label="Token B"
              selectedToken={tokenB}
              onTokenSelect={setTokenB}
              placeholder="Select second token"
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapTokens}
              className="gap-2"
              disabled={!tokenA || !tokenB}
            >
              <ArrowUpDown className="h-4 w-4" />
              Swap
            </Button>
          </div>
        </div>
      </div>

      {tokenA && tokenB && (
        <PriceDisplay tokenA={tokenA} tokenB={tokenB} />
      )}
    </div>
  )
}