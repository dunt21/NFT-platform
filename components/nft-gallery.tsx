/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, User, Loader2 } from "lucide-react";
import { useContract } from "@/hooks/use-contract";
import { useWallet } from "@/hooks/use-wallet";
import { fetchFromIPFS } from "@/lib/ipfs-pinata";

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  owner: string;
  tokenURI: string;
}

interface NFTGalleryProps {
  onStatsUpdate: (stats: {
    totalNFTs: number;
    totalRewards: number;
    myNFTs: number;
  }) => void;
}

export default function NFTGallery({ onStatsUpdate }: NFTGalleryProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [loading, setLoading] = useState(true);

  const { getAllNFTs, getTotalNFTSupply } = useContract();
  const { account } = useWallet();

  useEffect(() => {
    loadNFTs();
  }, []);

  useEffect(() => {
    filterNFTs();
  }, [nfts, searchTerm, filter, account]);

  const loadNFTs = async () => {
    try {
      setLoading(true);

      // Get all NFTs from contract
      const contractNFTs = await getAllNFTs();
      const nftsWithMetadata: NFT[] = [];

      // Fetch metadata for each NFT
      for (const nft of contractNFTs) {
        try {
          let metadata = {
            name: `NFT #${nft.tokenId}`,
            description: "No description available",
            image: "/placeholder.svg?height=300&width=300",
          };

          // Try to fetch metadata from IPFS
          if (nft.tokenURI && nft.tokenURI.startsWith("ipfs://")) {
            try {
              metadata = await fetchFromIPFS(nft.tokenURI);
            } catch (error) {
              console.error(
                `Failed to fetch metadata for token ${nft.tokenId}:`,
                error
              );
            }
          }

          nftsWithMetadata.push({
            tokenId: nft.tokenId,
            name: metadata.name,
            description: metadata.description,
            image:
              metadata.image?.replace(
                "ipfs://",
                "https://gateway.pinata.cloud/ipfs/"
              ) || "/placeholder.svg?height=300&width=300",
            creator: nft.owner, // In your contract, you might want to track the original creator separately
            owner: nft.owner,
            tokenURI: nft.tokenURI,
          });
        } catch (error) {
          console.error(`Error processing NFT ${nft.tokenId}:`, error);
        }
      }

      setNfts(nftsWithMetadata);

      // Update stats
      const myNFTs = nftsWithMetadata.filter(
        (nft) =>
          nft.creator.toLowerCase() === account?.toLowerCase() ||
          nft.owner.toLowerCase() === account?.toLowerCase()
      ).length;

      onStatsUpdate({
        totalNFTs: nftsWithMetadata.length,
        totalRewards: nftsWithMetadata.length * 10, // Assuming 10 tokens per NFT
        myNFTs,
      });
    } catch (error) {
      console.error("Error loading NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNFTs = () => {
    let filtered = nfts;

    // Filter by ownership
    if (filter === "mine" && account) {
      filtered = filtered.filter(
        (nft) =>
          nft.creator.toLowerCase() === account.toLowerCase() ||
          nft.owner.toLowerCase() === account.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNfts(filtered);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isMyNFT = (nft: NFT) => {
    return (
      account &&
      (nft.creator.toLowerCase() === account.toLowerCase() ||
        nft.owner.toLowerCase() === account.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading NFTs from blockchain...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All NFTs ({nfts.length})
          </Button>
          <Button
            variant={filter === "mine" ? "default" : "outline"}
            onClick={() => setFilter("mine")}
          >
            My NFTs ({nfts.filter((nft) => isMyNFT(nft)).length})
          </Button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={loadNFTs} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Refresh
        </Button>
      </div>

      {/* NFT Grid */}
      {filteredNfts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              {filter === "mine"
                ? "You haven't created or owned any NFTs yet."
                : nfts.length === 0
                ? "No NFTs have been minted yet. Be the first to create one!"
                : "No NFTs found matching your search."}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNfts.map((nft) => (
            <Card
              key={nft.tokenId}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder.svg?height=300&width=300";
                  }}
                />
                {isMyNFT(nft) && (
                  <Badge className="absolute top-2 right-2">Mine</Badge>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{nft.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {nft.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Owner:</span>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-mono">
                          {formatAddress(nft.owner)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Token ID:</span>
                      <span className="font-mono">#{nft.tokenId}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={`https://sepolia-blockscout.lisk.com/token/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}/instance/${nft.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
