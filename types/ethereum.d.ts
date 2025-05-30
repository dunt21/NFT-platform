/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
    selectedAddress: string | null;
    chainId: string;
    networkVersion: string;
    isConnected: () => boolean;
  };
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        handler: (...args: any[]) => void
      ) => void;
      selectedAddress: string | null;
      chainId: string;
      networkVersion: string;
      isConnected: () => boolean;
    };
  }
}

export {};
