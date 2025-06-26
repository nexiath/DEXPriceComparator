'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          variant="default"
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          Connect {connector.name}
        </Button>
      ))}
    </div>
  )
}