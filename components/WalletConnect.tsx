"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WalletConnectProps {
  account: string
  connectWallet: () => void
}

export default function WalletConnect({ account, connectWallet }: WalletConnectProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          {account ? "Connected Account:" : "Connect your wallet to mint NFTs and earn tokens"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {account ? (
            <div className="font-mono bg-gray-100 p-3 rounded-lg">{formatAddress(account)}</div>
          ) : (
            <div className="text-gray-500">No wallet connected</div>
          )}

          <Button
            onClick={connectWallet}
            disabled={!!account}
            variant={account ? "secondary" : "default"}
            className="min-w-[150px]"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {account ? "Connected" : "Connect Wallet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
