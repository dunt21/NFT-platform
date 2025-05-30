/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Coins, ImageIcon, Trophy, Sparkles, Zap } from "lucide-react";
import WalletConnection from "@/components/wallet-connection";
import MintingForm from "@/components/minting-form";
import NFTGallery from "@/components/nft-gallery";
import RewardTracker from "@/components/reward-tracker";
import { useWallet } from "@/hooks/use-wallet";

export default function NFTPlatform() {
  const { account, balance, tokenBalance, connectWallet, isConnected } =
    useWallet();
  const [stats, setStats] = useState({
    totalNFTs: 0,
    totalRewards: 0,
    myNFTs: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CreatorVerse
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mint unique NFTs and earn Creator Tokens. A decentralized platform
            rewarding digital artists with every creation.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Instant Rewards</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4 text-blue-500" />
              <span>IPFS Storage</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-purple-500" />
              <span>Creator Economy</span>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-12">
          <WalletConnection />
        </div>

        {isConnected ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    ETH Balance
                  </CardTitle>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {balance} ETH
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Available for transactions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Creator Tokens
                  </CardTitle>
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Coins className="h-4 w-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {tokenBalance} CT
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Earned from minting
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Total NFTs
                  </CardTitle>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {stats.totalNFTs}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Minted on platform
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                    My NFTs
                  </CardTitle>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {stats.myNFTs}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Your creations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <Tabs defaultValue="mint" className="space-y-8">
                  <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <TabsTrigger
                      value="mint"
                      className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Mint NFT
                    </TabsTrigger>
                    <TabsTrigger
                      value="gallery"
                      className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                    >
                      <Trophy className="h-4 w-4" />
                      Gallery
                    </TabsTrigger>
                    <TabsTrigger
                      value="rewards"
                      className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                    >
                      <Coins className="h-4 w-4" />
                      Rewards
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="mint" className="space-y-6">
                    <MintingForm />
                  </TabsContent>

                  <TabsContent value="gallery" className="space-y-6">
                    <NFTGallery onStatsUpdate={setStats} />
                  </TabsContent>

                  <TabsContent value="rewards" className="space-y-6">
                    <RewardTracker />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md mx-auto border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl w-fit">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">
                  Welcome to CreatorVerse
                </CardTitle>
                <CardDescription className="text-base">
                  Connect your wallet to start minting NFTs and earning Creator
                  Tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <Button
                  onClick={connectWallet}
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
                <p className="text-xs text-muted-foreground">
                  Make sure you have MetaMask installed and are on Lisk Sepolia
                  network
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
