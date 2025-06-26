export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI: string
}

export const TOKENS: Record<string, Token> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86a33E6441946F5eBE7F1b90cAe8eb3C6B323A',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86a33e6441946f5ebe7f1b90cae8eb3c6b32a.png'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C77E4c2e3ac3EB4A9F5c53F1a1',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c77e4c2e3ac3eb4a9f5c53f1a1.png'
  },
  UNI: {
    symbol: 'UNI',
    name: 'Uniswap',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png'
  },
  LINK: {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png'
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png'
  }
}

export const TOKEN_LIST = Object.values(TOKENS)

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return TOKENS[symbol.toUpperCase()]
}

export const getTokenByAddress = (address: string): Token | undefined => {
  return TOKEN_LIST.find(token => 
    token.address.toLowerCase() === address.toLowerCase()
  )
}