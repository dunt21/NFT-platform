/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract } from "./use-contract";

// Type guard to check if ethereum exists
const isEthereumAvailable = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
};

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [nftBalance, setNftBalance] = useState(0);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { getCreatorTokenBalance, getNFTBalance } = useContract();

  useEffect(() => {
    checkConnection();

    if (isEthereumAvailable()) {
      window.ethereum!.on("accountsChanged", handleAccountsChanged);
      window.ethereum!.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (isEthereumAvailable()) {
        window.ethereum!.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum!.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      updateBalances();
    }
  }, [account]);

  const checkConnection = async () => {
    if (isEthereumAvailable()) {
      try {
        const accounts = await window.ethereum!.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);

          const chainId = await window.ethereum!.request({
            method: "eth_chainId",
          });
          setChainId(Number.parseInt(chainId, 16));
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!isEthereumAvailable()) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setIsConnected(true);

      const chainId = await window.ethereum!.request({ method: "eth_chainId" });
      setChainId(Number.parseInt(chainId, 16));

      // Switch to Lisk Sepolia if not already connected
      if (Number.parseInt(chainId, 16) !== 4202) {
        await switchToLiskSepolia();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const switchToLiskSepolia = async () => {
    if (!isEthereumAvailable()) return;

    try {
      await window.ethereum!.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x106A" }], // 4202 in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum!.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x106A",
                chainName: "Lisk Sepolia Testnet",
                nativeCurrency: {
                  name: "Sepolia Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
                blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      }
    }
  };

  const updateBalances = async () => {
    if (account && isEthereumAvailable()) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum!);

        // Get ETH balance
        const ethBalance = await provider.getBalance(account);
        setBalance(
          Number.parseFloat(ethers.formatEther(ethBalance)).toFixed(4)
        );

        // Get Creator Token balance
        const creatorTokenBalance = await getCreatorTokenBalance(account);
        setTokenBalance(Number.parseFloat(creatorTokenBalance).toFixed(2));

        // Get NFT balance
        const nftCount = await getNFTBalance(account);
        setNftBalance(nftCount);
      } catch (error) {
        console.error("Error updating balances:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
      setBalance("0");
      setTokenBalance("0");
      setNftBalance(0);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(Number.parseInt(chainId, 16));
    window.location.reload();
  };

  return {
    account,
    balance,
    tokenBalance,
    nftBalance,
    chainId,
    isConnected,
    connectWallet,
    switchToLiskSepolia,
    updateBalances,
  };
}
