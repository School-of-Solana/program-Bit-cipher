import { Flame, Calendar } from "lucide-react";
import { useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useAnchorProgram } from "../utils/anchor";
import * as anchor from "@solana/web3.js";
import { Buffer } from "buffer";
window.Buffer = Buffer;

export default function HabitCard({ habit, onCheckIn }) {
  const wallet = useAnchorWallet();
  const program = useAnchorProgram();
  const [loading, setLoading] = useState(false);

  const timeUntilNextCheckIn = () => {
    const now = Date.now();
    const elapsed = now - habit.lastCheckIn * 1000;
    const remaining = 24 * 60 * 60 * 1000 - elapsed;

    if (remaining <= 0) return "Available now!";

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}h ${minutes}m`;
  };

  const canCheckIn = () => {
    if (habit.lastCheckIn === 0) return true;
    const now = Date.now();
    const elapsed = now - habit.lastCheckIn * 1000;
    return elapsed >= 24 * 60 * 60 * 1000;
  };

  const handleCheckIn = async () => {
    if (!program || !wallet) return;

    // Retrieve the correct nonce from local storage to derive the PDA
    const localHabits = JSON.parse(localStorage.getItem("habits") || "[]");
    const habitData = localHabits.find((h) => h.name === habit.name);

    if (!habitData || habitData.nonce === undefined) {
      alert("Error: Could not find habit nonce for PDA derivation.");
      return;
    }

    const habitNonce = habitData.nonce;

    setLoading(true);
    try {
      const [habitPda] = anchor.PublicKey.findProgramAddressSync(
        [
          Buffer.from("habit"),
          wallet.publicKey.toBuffer(),
          Uint8Array.from([habitNonce]),
        ],
        program.programId
      );

      const tx = await program.methods
        .checkIn(habitNonce)
        .accounts({
          habit: habitPda,
          owner: wallet.publicKey,
        })
        .rpc();

      console.log("Check-in successful! Tx:", tx);
      alert("Check-in successful! 🎉");

      if (onCheckIn) onCheckIn();
    } catch (error) {
      console.error("Error checking in:", error);

      if (error.message.includes("CooldownNotElapsed")) {
        alert("You need to wait 24 hours between check-ins!");
      } else {
        alert("Failed to check in: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isAvailable = canCheckIn();

  return (
    <div
      className="habit-card"
      style={{
        background: "linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)",
        borderRadius: "16px",
        padding: "1.5rem",
        border: "2px solid #f0f0f0",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ margin: 0, color: "#333", fontSize: "1.2rem" }}>
          {habit.name}
        </h3>
        <div
          style={{
            background: isAvailable ? "#10b981" : "#e5e7eb",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Flame size={20} color="#f59e0b" />
          <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
            {habit.count.toString()}
          </span>
          <span style={{ color: "#666", fontSize: "0.9rem" }}>day streak</span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {habit.streak7 && (
            <span
              className="badge"
              style={{
                padding: "0.25rem 0.75rem",
                background: "#fef3c7",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#92400e",
              }}
            >
              🔥 7 Day
            </span>
          )}
          {habit.streak30 && (
            <span
              className="badge"
              style={{
                padding: "0.25rem 0.75rem",
                background: "#dbeafe",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#1e40af",
              }}
            >
              💪 30 Day
            </span>
          )}
        </div>
      </div>

      {habit.lastCheckIn > 0 && (
        <div
          style={{
            fontSize: "0.85rem",
            color: "#999",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Calendar size={16} />
          Next check-in: {timeUntilNextCheckIn()}
        </div>
      )}

      <button
        onClick={handleCheckIn}
        disabled={!isAvailable || loading}
        style={{
          width: "100%",
          padding: "0.875rem",
          background: isAvailable
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "#e5e7eb",
          color: isAvailable ? "white" : "#999",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: isAvailable && !loading ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}
      >
        {loading
          ? "⏳ Checking in..."
          : isAvailable
          ? "✅ Check In Now"
          : "🔒 Come Back Tomorrow"}
      </button>
    </div>
  );
}
