"use client"
import { Coins, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RewardEvent {
  tokenId: string
  creator: string
  timestamp: string
}

interface TokenBalanceProps {
  balance: string
  rewardEvents: RewardEvent[]
}

export default function TokenBalance({ balance, rewardEvents }: TokenBalanceProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Creator Tokens
        </CardTitle>
        <CardDescription>Track your earnings and reward history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="rewards">History</TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-4">
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">{balance}</div>
              <p className="text-gray-500">Creator Tokens</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>10 CT per mint</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="max-h-64 overflow-y-auto">
              {rewardEvents.length > 0 ? (
                <div className="space-y-3">
                  {rewardEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">NFT #{event.tokenId}</div>
                        <div className="text-sm text-gray-500">Creator: {formatAddress(event.creator)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">+10 CT</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No reward events found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
