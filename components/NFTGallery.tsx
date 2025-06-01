import { Grid, Loader2, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NFT {
  id: number
  name: string
  description: string
  image: string
  creator: string
}

interface NFTGalleryProps {
  nfts: NFT[]
  isLoading: boolean
  account: string
}

export default function NFTGallery({ nfts, isLoading, account }: NFTGalleryProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
          <CardDescription>Loading NFTs...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-purple-600 mb-4" />
          <p className="text-gray-500">Loading NFTs...</p>
        </CardContent>
      </Card>
    )
  }

  if (nfts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
          <CardDescription>Explore all minted NFTs on the platform</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Grid className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
          <p className="text-gray-500 mb-4">Be the first to mint an NFT on this platform!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Gallery</CardTitle>
        <CardDescription>Explore all minted NFTs on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2">#{nft.id}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{nft.name}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{nft.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="font-mono">{formatAddress(nft.creator)}</span>
                  </div>
                  {nft.creator.toLowerCase() === account.toLowerCase() && (
                    <Badge variant="secondary" className="text-xs">
                      Your NFT
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
