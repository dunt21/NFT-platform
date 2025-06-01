"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Award, RefreshCw } from "lucide-react"

interface RewardEvent {
  id: string
  creator: string
  amount: string
  nftName: string
  timestamp: Date
  txHash: string
}

export function RewardSystem() {
  const [tokenBalance, setTokenBalance] = useState("0")
  const [totalEarned, setTotalEarned] = useState("0")
  const [rewardEvents, setRewardEvents] = useState<RewardEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRewardData()
  }, [])

  const fetchRewardData = async () => {
    setIsLoading(true)

    // Simulate fetching data from blockchain
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data - replace with actual contract calls
    setTokenBalance("150.5")
    setTotalEarned("275.0")

    // Mock reward events - replace with actual event listening
    const mockEvents: RewardEvent[] = [
      {
        id: "1",
        creator: "0x1234...5678",
        amount: "10.0",
        nftName: "Digital Sunset",
        timestamp: new Date(Date.now() - 3600000),
        txHash: "0xabc123...",
      },
      {
        id: "2",
        creator: "0x8765...4321",
        amount: "15.0",
        nftName: "Abstract Dreams",
        timestamp: new Date(Date.now() - 7200000),
        txHash: "0xdef456...",
      },
      {
        id: "3",
        creator: "0x1111...2222",
        amount: "8.5",
        nftName: "Cosmic Journey",
        timestamp: new Date(Date.now() - 10800000),
        txHash: "0xghi789...",
      },
    ]

    setRewardEvents(mockEvents)
    setIsLoading(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours === 1) return "1 hour ago"
    return `${hours} hours ago`
  }

  return (
    <div className="space-y-6">
      {/* Token Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenBalance} CT</div>
            <p className="text-xs text-muted-foreground">Creator Tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarned} CT</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10 CT</div>
            <p className="text-xs text-muted-foreground">Per NFT mint</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Rewards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Rewards</CardTitle>
              <CardDescription>Track your creator token earnings from NFT mints</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchRewardData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rewardEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No rewards yet. Start creating NFTs to earn tokens!</div>
          ) : (
            <div className="space-y-4">
              {rewardEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Coins className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{event.nftName}</p>
                      <p className="text-sm text-gray-500">Creator: {formatAddress(event.creator)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      +{event.amount} CT
                    </Badge>
                    <p className="text-xs text-gray-500">{formatTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
