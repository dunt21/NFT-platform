import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Card, CardContent } from "./ui/card";
import useFetch from "../hooks/useFetch";
import { getContractConfig } from "../services/contract";

const RewardDisplay = () => {
  const { address } = useAccount();
  const [rewards, setRewards] = useState([]);
  const [provider, setProvider] = useState(null);

  const {
    data: balance,
    isLoading,
    error,
  } = useFetch({
    ...getContractConfig("CREATOR_TOKEN"),
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
  });

  useEffect(() => {
    const setupProvider = async () => {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    };
    setupProvider();
  }, []);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!provider || !address) return;
      try {
        const contract = new ethers.Contract(
          import.meta.env.VITE_ART_NFT_ADDRESS,
          getContractConfig("ART_NFT").abi,
          provider
        );
        const filter = contract.filters.CreatorRewarded(address);
        const events = await contract.queryFilter(filter);
        const rewardList = events.map((event) => ({
          amount: ethers.formatEther(event.args.amount),
          blockNumber: event.blockNumber,
        }));
        setRewards(rewardList);
      } catch (err) {
        console.error("Error fetching rewards:", err);
      }
    };
    fetchRewards();
  }, [provider, address]);

  if (isLoading) return <p>Loading balance...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Reward Log</h2>
      <Card>
        <CardContent className="p-4">
          <p className="text-lg">
            RWD Balance: {balance ? ethers.formatEther(balance) : "0"} RWD
          </p>
          <ul className="mt-4 space-y-2">
            {rewards.map((reward, index) => (
              <li key={index} className="text-gray-700">
                Received {reward.amount} RWD at block {reward.blockNumber}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardDisplay;
