import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import useFetch from "../hooks/useFetch";
import { getContractConfig } from "../services/contract";

const NFTGallery = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);

  const {
    data: tokenIds,
    isLoading,
    error,
  } = useFetch({
    ...getContractConfig("ART_NFT"),
    functionName: "getNFTsByCreator",
    args: [address],
    enabled: !!address,
  });

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!tokenIds) return;
      try {
        const nftList = await Promise.all(
          tokenIds.map(async (id) => {
            const tokenId = id.toString();
            const { data: tokenURI } = await axios.get(
              `https://rpc.sepolia-api.lisk.com/tokenURI/${tokenId}`,
              { data: { tokenId } }
            );
            const metadata = await axios.get(
              tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            );
            return { id: tokenId, ...metadata.data };
          })
        );
        setNfts(nftList);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      }
    };
    fetchNFTs();
  }, [tokenIds]);

  if (isLoading) return <p>Loading NFTs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Created NFTs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.id}>
            <CardContent className="p-4">
              <img
                src={nft.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{nft.name}</h3>
              <p className="text-gray-600">{nft.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
