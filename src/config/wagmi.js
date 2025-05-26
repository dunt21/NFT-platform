import { createConfig, http } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { injected } from "wagmi/connectors";

const liskSepoliaChain = {
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
  },

  blockExplorers: {
    default: {
      name: "Lisk Sepolia Explorer",
      url: "https://sepolia-blockscout.lisk.com",
    },
  },

  testnet: true,
};

const projectId = import.meta.env.VITE_REOWN_PROEJECT_ID;
if (!projectId) {
  throw new Error("Reown Project ID is not defined");
}

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [liskSepoliaChain],
});

export const config = createConfig({
  chains: [liskSepoliaChain],
  connectors: [wagmiAdapter.connectors[0], injected({ target: "metaMask" })],
  transports: {
    [liskSepoliaChain]: http(),
  },
  ssr: true,
});
