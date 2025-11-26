import { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useAnchorProgram } from "../utils/anchor";
import HabitCard from "./HabitCard";

export default function HabitList({ refreshTrigger }) {
  const wallet = useAnchorWallet();
  const program = useAnchorProgram();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHabits = async () => {
    if (!program || !wallet) {
      setHabits([]);
      return;
    }

    setLoading(true);
    try {
      const accounts = await program.account.habit.all([
        {
          memcmp: {
            offset: 8,
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ]);

      setHabits(accounts.map((acc) => acc.account));
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [program, wallet, refreshTrigger]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          color: "#666",
        }}
      >
        ⏳ Loading your habits...
      </div>
    );
  }

  if (!wallet) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔌</div>
        <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>
          Wallet not connected
        </h3>
        <p style={{ color: "#999" }}>
          Please connect your wallet to view habits
        </p>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
        <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>
          No habits yet!
        </h3>
        <p style={{ color: "#999" }}>Create your first habit to get started</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "3rem" }}>
      <div
        style={{
          display: "grid",
          // Responsive grid: minimum 300px wide columns
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {habits.map((habit, index) => (
          <HabitCard key={index} habit={habit} onCheckIn={fetchHabits} />
        ))}
      </div>

      <button
        onClick={fetchHabits}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 2rem",
          background: "#667eea",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        🔄 Refresh
      </button>
    </div>
  );
}
