import { Palette } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8" />
            <h1 className="text-2xl font-bold">NFT Creator Platform</h1>
          </div>
          <div>
            <p className="text-sm opacity-75">Reward Creators • Mint NFTs • Build Community</p>
          </div>
        </div>
      </div>
    </header>
  )
}
