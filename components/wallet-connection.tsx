"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletConnection() {
  const [account, setAccount] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    checkConnection()
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(chainId)
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      })
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setIsConnected(true)
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      setChainId(chainId)

      toast({
        title: "Wallet connected",
        description: "Successfully connected to MetaMask",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount("")
      setIsConnected(false)
    } else {
      setAccount(accounts[0])
      setIsConnected(true)
    }
  }

  const handleChainChanged = (chainId: string) => {
    setChainId(chainId)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(account)
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case "0x1":
        return "Ethereum Mainnet"
      case "0x5":
        return "Goerli Testnet"
      case "0xaa36a7":
        return "Sepolia Testnet"
      case "0x89":
        return "Polygon Mainnet"
      case "0x13881":
        return "Mumbai Testnet"
      default:
        return "Unknown Network"
    }
  }

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>Connect your MetaMask wallet to start minting NFTs and earning rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectWallet} className="w-full" size="lg">
            Connect MetaMask
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connected
          </span>
          <Badge variant="secondary">{getNetworkName(chainId)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-mono text-sm">{formatAddress(account)}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyAddress}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://etherscan.io/address/${account}`, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
