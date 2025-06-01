"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, User } from "lucide-react"

interface NFT {
  id: string
  tokenId: string
  name: string
  description: string
  image: string
  creator: string
  owner: string
  mintedAt: Date
}

export function NFTGallery() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNFTs()
  }, [])

  useEffect(() => {
    const filtered = nfts.filter(
      (nft) =>
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.creator.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredNfts(filtered)
  }, [nfts, searchTerm])

  const fetchNFTs = async () => {
    setIsLoading(true)

    // Simulate fetching NFTs from contract
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock NFT data - replace with actual contract calls
    const mockNFTs: NFT[] = [
      {
        id: "1",
        tokenId: "1",
        name: "Digital Sunset",
        description: "A beautiful digital representation of a sunset over the mountains",
        image: "/placeholder.svg?height=300&width=300",
        creator: "0x1234567890123456789012345678901234567890",
        owner: "0x1234567890123456789012345678901234567890",
        mintedAt: new Date(Date.now() - 86400000),
      },
      {
        id: "2",
        tokenId: "2",
        name: "Abstract Dreams",
        description: "An abstract piece representing the complexity of dreams",
        image: "/placeholder.svg?height=300&width=300",
        creator: "0x8765432109876543210987654321098765432109",
        owner: "0x8765432109876543210987654321098765432109",
        mintedAt: new Date(Date.now() - 172800000),
      },
      {
        id: "3",
        tokenId: "3",
        name: "Cosmic Journey",
        description: "A journey through space and time captured in digital art",
        image: "/placeholder.svg?height=300&width=300",
        creator: "0x1111222233334444555566667777888899990000",
        owner: "0x1111222233334444555566667777888899990000",
        mintedAt: new Date(Date.now() - 259200000),
      },
      {
        id: "4",
        tokenId: "4",
        name: "Neon City",
        description: "A cyberpunk-inspired cityscape with neon lights",
        image: "/placeholder.svg?height=300&width=300",
        creator: "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaa",
        owner: "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaaa",
        mintedAt: new Date(Date.now() - 345600000),
      },
    ]

    setNfts(mockNFTs)
    setIsLoading(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
          <CardDescription>Loading NFTs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
          <CardDescription>Explore all minted NFTs on the platform</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search NFTs, creators, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredNfts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No NFTs found matching your search." : "No NFTs minted yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNfts.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2">#{nft.tokenId}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{nft.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{nft.description}</p>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Creator:</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="font-mono">{formatAddress(nft.creator)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Minted:</span>
                        <span>{formatDate(nft.mintedAt)}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View on Explorer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
