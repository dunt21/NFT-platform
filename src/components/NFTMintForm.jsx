import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NFTStorage } from "nft.storage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { getContractConfig } from "../services/contract";

const NFTMintForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !file) {
      alert("Please fill all fields and select an image.");
      return;
    }

    try {
      setIsMinting(true);
      const client = new NFTStorage({
        token: import.meta.env.VITE_NFT_STORAGE_API_KEY,
      });
      const metadata = await client.store({
        name,
        description,
        image: file,
      });
      const tokenURI = metadata.url;

      await writeContract({
        ...getContractConfig("ART_NFT"),
        functionName: "mintNft",
        args: [tokenURI],
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT.");
      setIsMinting(false);
    }
  };

  if (isSuccess) {
    setIsMinting(false);
    setName("");
    setDescription("");
    setFile(null);
    alert("NFT minted successfully!");
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Create NFT</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="NFT Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isMinting}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isMinting}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isMinting}
        />
        <Button type="submit" disabled={isMinting || isConfirming}>
          {isMinting || isConfirming ? "Minting..." : "Mint NFT"}
        </Button>
      </form>
    </div>
  );
};

export default NFTMintForm;
