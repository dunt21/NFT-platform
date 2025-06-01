// Web3 utilities for contract interaction
import { ethers } from "ethers"
import { CONTRACTS, NFT_ABI, TOKEN_ABI } from "./contracts"

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  throw new Error("No ethereum provider found")
}

export const getSigner = async () => {
  const provider = getProvider()
  return await provider.getSigner()
}

export const getNFTContract = async () => {
  const signer = await getSigner()
  return new ethers.Contract(CONTRACTS.NFT_CONTRACT_ADDRESS, NFT_ABI, signer)
}

export const getTokenContract = async () => {
  const signer = await getSigner()
  return new ethers.Contract(CONTRACTS.TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer)
}

export const mintNFT = async (tokenURI: string) => {
  const contract = await getNFTContract()
  const tx = await contract.mint(tokenURI)
  return await tx.wait()
}

export const getTokenBalance = async (address: string) => {
  const contract = await getTokenContract()
  const balance = await contract.balanceOf(address)
  return ethers.formatEther(balance)
}

export const getAllNFTs = async () => {
  const contract = await getNFTContract()
  const totalSupply = await contract.totalSupply()

  const nfts = []
  for (let i = 1; i <= totalSupply; i++) {
    try {
      const tokenURI = await contract.tokenURI(i)
      const owner = await contract.ownerOf(i)

      // Fetch metadata from IPFS
      const response = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"))
      const metadata = await response.json()

      nfts.push({
        tokenId: i,
        owner,
        ...metadata,
      })
    } catch (error) {
      console.error(`Error fetching NFT ${i}:`, error)
    }
  }

  return nfts
}
