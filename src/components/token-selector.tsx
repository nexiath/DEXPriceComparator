'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { TOKEN_LIST, type Token } from '@/lib/tokens'
import Image from 'next/image'

interface TokenSelectorProps {
  label: string
  selectedToken?: Token
  onTokenSelect: (token: Token) => void
  placeholder?: string
}

export function TokenSelector({ label, selectedToken, onTokenSelect, placeholder }: TokenSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`token-${label.toLowerCase()}`} className="text-sm font-medium">
        {label}
      </Label>
      <Select
        value={selectedToken?.symbol || ''}
        onValueChange={(value) => {
          const token = TOKEN_LIST.find(t => t.symbol === value)
          if (token) onTokenSelect(token)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || `Select ${label}`}>
            {selectedToken && (
              <div className="flex items-center gap-2">
                <Image
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{selectedToken.symbol}</span>
                <span className="text-muted-foreground text-sm">
                  {selectedToken.name}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TOKEN_LIST.map((token) => (
            <SelectItem key={token.symbol} value={token.symbol}>
              <div className="flex items-center gap-2">
                <Image
                  src={token.logoURI}
                  alt={token.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="font-medium">{token.symbol}</span>
                <span className="text-muted-foreground text-sm">
                  {token.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}