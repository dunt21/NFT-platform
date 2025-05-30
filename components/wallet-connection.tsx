"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";

export default function WalletConnection() {
  const {
    account,
    balance,
    tokenBalance,
    connectWallet,
    isConnected,
    chainId,
  } = useWallet();

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success("Address copied!", {
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl w-fit">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Connect your MetaMask wallet to interact with the CreatorVerse
            platform and start your NFT journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={connectWallet}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect MetaMask
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have MetaMask?
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 ml-1 underline"
              >
                Download here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCorrectNetwork = chainId === 4202;

  return (
    <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Wallet Connected</h3>
              <p className="text-sm text-muted-foreground">
                Ready to mint and earn
              </p>
            </div>
          </span>
          <Badge
            variant={isCorrectNetwork ? "default" : "destructive"}
            className={`px-3 py-1 ${
              isCorrectNetwork
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {isCorrectNetwork ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {isCorrectNetwork ? "Lisk Sepolia" : "Wrong Network"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Section */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Wallet Address
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatAddress(account!)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="h-10 w-10 p-0 hover:bg-blue-50 hover:border-blue-200"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-10 w-10 p-0 hover:bg-blue-50 hover:border-blue-200"
              >
                <a
                  href={`https://sepolia-blockscout.lisk.com/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    ETH Balance
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {balance} ETH
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Wallet className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Creator Tokens
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {tokenBalance} CT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!isCorrectNetwork && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">
                  Wrong Network
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Please switch to Lisk Sepolia network to use this platform
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
