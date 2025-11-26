import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

// Wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

const CLUSTER_URL = "https://api.devnet.solana.com"; // change to localnet if you need

export function WalletProviderWrapper({ children }) {
  const endpoint = CLUSTER_URL;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <WalletMultiButton />
            </div>
            {children}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
