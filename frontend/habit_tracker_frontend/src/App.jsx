import { useState, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import CreateHabit from "./components/CreateHabit";
import HabitList from "./components/HabitList";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";

function AppContent() {
  const wallet = useAnchorWallet();
  const [activeTab, setActiveTab] = useState("habits");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleHabitCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab("habits");
  };

  return (
    <div className="app-container">
      <Header />

      {/* NOTE: StatsCards currently uses an empty array; you will need to load data here or pass it from HabitList */}
      {wallet && <StatsCards habits={[]} />}

      <div className="main-content">
        {" "}
        {/* CSS handles centering and max-width now */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("create")}
            className={`tab ${activeTab === "create" ? "active" : ""}`}
            style={{ padding: "1rem 1.25rem" }} // Maintain original padding for tab height
          >
            ✨ Create Habit
          </button>
          <button
            onClick={() => setActiveTab("habits")}
            className={`tab ${activeTab === "habits" ? "active" : ""}`}
            style={{ padding: "1rem 1.25rem" }} // Maintain original padding for tab height
          >
            📊 My Habits
          </button>
        </div>
        {activeTab === "create" && (
          <CreateHabit onHabitCreated={handleHabitCreated} />
        )}
        {activeTab === "habits" && (
          <HabitList refreshTrigger={refreshTrigger} />
        )}
      </div>

      <div className="footer">
        <p>Built on Solana • Immutable • Decentralized</p>
      </div>
    </div>
  );
}

export default function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
