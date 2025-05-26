import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "@0xfamily/connectkit";
import { config } from "../../config/wagmi";

const Web3Provider = ({ children }) => (
  <WagmiProvider config={config}>
    <ConnectKitProvider
      options={{
        walletConnectProjectId: import.meta.env.VITE_REOWN_PROJECT_ID,
      }}
    >
      {children}
    </ConnectKitProvider>
  </WagmiProvider>
);

export default Web3Provider;
