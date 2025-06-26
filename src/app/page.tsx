import { WalletConnect } from '@/components/wallet-connect'
import { TokenSelection } from '@/components/token-selection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            DEX Price Comparator
          </h1>
          <WalletConnect />
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Compare DEX Prices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Find the best prices across decentralized exchanges in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                🔍 Price Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Compare token prices across multiple DEXs to find the best rates
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                ⚡ Real-time Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get live pricing data from Uniswap, SushiSwap, and more
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                💰 Save Money
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maximize your trades by finding the most profitable routes
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <TokenSelection />
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Ready to Start Trading?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Connect your wallet to access real-time DEX price comparisons
                </p>
                <div className="flex justify-center">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}