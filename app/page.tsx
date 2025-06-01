"use client"

import { useState } from "react"
import Header from "@/components/Header"
import WalletConnect from "@/components/WalletConnect"
import NFTMinter from "@/components/NFTMinter"
import TokenBalance from "@/components/TokenBalance"
import NFTGallery from "@/components/NFTGallery"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

// Contract addresses - replace with your deployed contract addresses
const TOKEN_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" // Replace with your CreatorToken address
const NFT_CONTRACT_ADDRESS = "0x0987654321098765432109876543210987654321" // Replace with your ArtNFT address

export default function App() {
  // State variables
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [tokenContract, setTokenContract] = useState(null)
  const [nftContract, setNftContract] = useState(null)
  const [tokenBalance, setTokenBalance] = useState("0")
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [rewardEvents, setRewardEvents] = useState([])
  const { toast } = useToast()

  // Connect to wallet and contracts
  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

        // Mock provider setup for preview
        setAccount(accounts[0] || "0x1234567890123456789012345678901234567890")

        // Mock token balance
        setTokenBalance("150.5")

        // Mock NFTs
        const mockNFTs = [
          {
            id: 1,
            name: "Digital Sunset",
            description: "A beautiful digital representation of a sunset over the mountains",
            image: "/placeholder.svg?height=300&width=300",
            creator: "0x1234567890123456789012345678901234567890",
          },
          {
            id: 2,
            name: "Abstract Dreams",
            description: "An abstract piece representing the complexity of dreams",
            image: "/placeholder.svg?height=300&width=300",
            creator: "0x8765432109876543210987654321098765432109",
          },
          {
            id: 3,
            name: "Cosmic Journey",
            description: "A journey through space and time captured in digital art",
            image: "/placeholder.svg?height=300&width=300",
            creator: "0x1111222233334444555566667777888899990000",
          },
        ]
        setNfts(mockNFTs)

        // Mock reward events
        const mockEvents = [
          {
            tokenId: "1",
            creator: "0x1234567890123456789012345678901234567890",
            timestamp: new Date().toLocaleString(),
          },
          {
            tokenId: "2",
            creator: "0x8765432109876543210987654321098765432109",
            timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          },
        ]
        setRewardEvents(mockEvents)

        toast({
          title: "Wallet connected",
          description: "Successfully connected to MetaMask",
        })
      } else {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to continue",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  // Mint NFT function
  const mintNFT = async (name, description, image) => {
    setIsLoading(true)
    try {
      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newNFT = {
        id: nfts.length + 1,
        name,
        description,
        image,
        creator: account,
      }

      setNfts([...nfts, newNFT])
      setTokenBalance((Number.parseFloat(tokenBalance) + 10).toString())

      toast({
        title: "NFT Minted Successfully!",
        description: `Your NFT "${name}" has been minted and you've earned 10 creator tokens!`,
      })
    } catch (error) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Minting failed",
        description: "There was an error minting your NFT",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <WalletConnect account={account} connectWallet={connectWallet} />

        {account && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <TokenBalance balance={tokenBalance} rewardEvents={rewardEvents} />
              <NFTMinter mintNFT={mintNFT} isLoading={isLoading} />
            </div>

            <NFTGallery nfts={nfts} isLoading={isLoading} account={account} />
          </>
        )}
      </main>
      <Toaster />
    </div>
  )
}
