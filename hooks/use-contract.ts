/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import {
  CREATOR_TOKEN_ADDRESS,
  CREATOR_TOKEN_ABI,
  NFT_CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
} from "@/lib/contract";

// Type guard to check if ethereum exists
const isEthereumAvailable = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
};

export function useContract() {
  const [loading, setLoading] = useState(false);

  const getProvider = async () => {
    if (!isEthereumAvailable()) {
      throw new Error("No ethereum provider found");
    }
    return new ethers.BrowserProvider(window.ethereum!);
  };

  const getNFTContract = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
  };

  const getCreatorTokenContract = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    return new ethers.Contract(
      CREATOR_TOKEN_ADDRESS,
      CREATOR_TOKEN_ABI,
      signer
    );
  };

  const getCreatorTokenContractReadOnly = async () => {
    const provider = await getProvider();
    return new ethers.Contract(
      CREATOR_TOKEN_ADDRESS,
      CREATOR_TOKEN_ABI,
      provider
    );
  };

  const getNFTContractReadOnly = async () => {
    const provider = await getProvider();
    return new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      provider
    );
  };

  const mintNFT = async (tokenURI: string): Promise<string> => {
    try {
      setLoading(true);
      const contract = await getNFTContract();

      // Call the mintNft function (note: lowercase 't' in your contract)
      const tx = await contract.mintNft(tokenURI);

      toast.success("Transaction submitted", {
        description: "Your NFT is being minted...",
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error: any) {
      console.error("Minting error:", error);
      throw new Error(error.message || "Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  const getCreatorTokenBalance = async (address: string): Promise<string> => {
    try {
      const contract = await getCreatorTokenContractReadOnly();
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error("Error fetching creator token balance:", error);
      return "0";
    }
  };

  const getNFTBalance = async (address: string): Promise<number> => {
    try {
      const contract = await getNFTContractReadOnly();
      const balance = await contract.balanceOf(address);
      return Number(balance);
    } catch (error) {
      console.error("Error fetching NFT balance:", error);
      return 0;
    }
  };

  const getTotalNFTSupply = async (): Promise<number> => {
    try {
      const contract = await getNFTContractReadOnly();
      const totalSupply = await contract.tokenCounter();
      return Number(totalSupply);
    } catch (error) {
      console.error("Error fetching total supply:", error);
      return 0;
    }
  };

  const getNFTsByOwner = async (address: string): Promise<any[]> => {
    try {
      const contract = await getNFTContractReadOnly();

      // Get NFTs by creator - your contract has a special function for this
      const tokenIds = await contract.getNFTsByCreator(address);

      const nfts = [];

      for (const tokenId of tokenIds) {
        try {
          const tokenURI = await contract.tokenURI(tokenId);
          const owner = await contract.ownerOf(tokenId);
          const creator = await contract.creators(tokenId);

          nfts.push({
            tokenId: tokenId.toString(),
            tokenURI,
            owner,
            creator,
          });
        } catch (error) {
          console.error(`Error fetching NFT ${tokenId}:`, error);
        }
      }

      return nfts;
    } catch (error) {
      console.error("Error fetching NFTs by owner:", error);
      return [];
    }
  };

  const getAllNFTs = async (): Promise<any[]> => {
    try {
      const contract = await getNFTContractReadOnly();
      const totalSupply = await contract.tokenCounter();
      const nfts = [];

      // Your contract starts token IDs at 1 (not 0)
      for (let i = 1; i <= Number(totalSupply); i++) {
        try {
          const tokenId = i;
          const tokenURI = await contract.tokenURI(tokenId);
          const owner = await contract.ownerOf(tokenId);
          const creator = await contract.creators(tokenId);

          nfts.push({
            tokenId: tokenId.toString(),
            tokenURI,
            owner,
            creator,
          });
        } catch (error) {
          console.error(`Error fetching NFT ${i}:`, error);
        }
      }

      return nfts;
    } catch (error) {
      console.error("Error fetching all NFTs:", error);
      return [];
    }
  };

  const getRewardEvents = async (userAddress?: string): Promise<any[]> => {
    try {
      const contract = await getNFTContractReadOnly();

      // Create filter for CreatorRewarded events (not RewardPaid)
      const filter = userAddress
        ? contract.filters.CreatorRewarded(null, userAddress)
        : contract.filters.CreatorRewarded();

      const events = await contract.queryFilter(filter, -10000); // Last 10000 blocks

      return events.map((event) => ({
        creator: event.args?.creator,
        amount: ethers.formatEther(event.args?.amount || 0),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        timestamp: new Date().toISOString(), // You might want to fetch actual block timestamp
      }));
    } catch (error) {
      console.error("Error fetching reward events:", error);
      return [];
    }
  };

  const transferCreatorTokens = async (
    to: string,
    amount: string
  ): Promise<string> => {
    try {
      setLoading(true);
      const contract = await getCreatorTokenContract();
      const decimals = await contract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);

      const tx = await contract.transfer(to, amountInWei);

      toast.success("Transfer submitted", {
        description: "Your tokens are being transferred...",
      });

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error("Transfer error:", error);
      throw new Error(error.message || "Failed to transfer tokens");
    } finally {
      setLoading(false);
    }
  };

  return {
    mintNFT,
    getCreatorTokenBalance,
    getNFTBalance,
    getTotalNFTSupply,
    getNFTsByOwner,
    getAllNFTs,
    getRewardEvents,
    transferCreatorTokens,
    loading,
  };
}
