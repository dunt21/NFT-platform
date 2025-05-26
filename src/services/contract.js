import ArtNftABI from "../contracts/ArtNft.json";
import CreatorTokenABI from "../contracts/CreatorToken.json";

export const CONTRACTS = {
  ART_NFT: {
    address: import.meta.env.VITE_ART_NFT_ADDRESS,
    abi: ArtNftABI,
  },
  CREATOR_TOKEN: {
    address: import.meta.env.VITE_CREATOR_TOKEN_ADDRESS,
    abi: CreatorTokenABI,
  },
};

export const getContractConfig = (contractName) => {
  const contract = CONTRACTS[contractName];
  if (!contractName) {
    throw new Error(`Contract ${contractName} not found`);
  }
  return {
    address: contract.address,
    abi: contract.abi,
  };
};
