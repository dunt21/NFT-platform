/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Coins,
  TrendingUp,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useContract } from "@/hooks/use-contract";
import { useWallet } from "@/hooks/use-wallet";

interface RewardEvent {
  id: string;
  creator: string;
  amount: string;
  timestamp: string;
  txHash: string;
  blockNumber: number;
}

export default function RewardTracker() {
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [totalEarned, setTotalEarned] = useState("0");
  const [loading, setLoading] = useState(true);

  const { getRewardEvents } = useContract();
  const { account } = useWallet();

  useEffect(() => {
    if (account) {
      loadRewards();
    }
  }, [account]);

  const loadRewards = async () => {
    try {
      setLoading(true);

      // Get reward events for the current user
      const events = await getRewardEvents(account!);

      const formattedRewards: RewardEvent[] = events.map((event, index) => ({
        id: `${event.transactionHash}-${index}`,
        creator: event.creator,
        amount: event.amount,
        timestamp: event.timestamp,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
      }));

      setRewards(formattedRewards);

      // Calculate total earned
      const total = formattedRewards.reduce(
        (sum, reward) => sum + Number.parseFloat(reward.amount),
        0
      );
      setTotalEarned(total.toFixed(2));
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarned} CT</div>
            <p className="text-xs text-muted-foreground">
              Creator Tokens earned from NFT mints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.length}</div>
            <p className="text-xs text-muted-foreground">
              Total reward transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Reward
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rewards.length > 0
                ? (Number.parseFloat(totalEarned) / rewards.length).toFixed(2)
                : "0"}{" "}
              CT
            </div>
            <p className="text-xs text-muted-foreground">Per NFT mint</p>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={loadRewards} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Refresh Events
        </Button>
      </div>

      {/* Rewards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reward History</CardTitle>
          <CardDescription>
            Track all Creator Token rewards earned from your NFT mints
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading reward events from blockchain...
                </p>
              </div>
            </div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No rewards earned yet.</p>
              <p className="text-sm">
                Create and mint NFTs to start earning Creator Tokens!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{reward.amount} CT</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      #{reward.blockNumber}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={`https://sepolia-blockscout.lisk.com/tx/${reward.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
