import React, { useState } from "react";
import { useAnchorProgram } from "../utils/anchor.js";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@solana/web3.js";

import { Buffer } from "buffer";
window.Buffer = Buffer;

export default function CreateHabit() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const [habitName, setHabitName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const createHabit = async () => {
    if (!program || !publicKey) {
      setStatus("Connect wallet first");
      return;
    }
    if (!habitName || habitName.length === 0) {
      setStatus("Enter a name");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Creating...");
      const nonce = Math.floor(Math.random() * 250);

      // PDA = ["habit", owner, nonce]
      const [pda] = anchor.PublicKey.findProgramAddressSync(
        [Buffer.from("habit"), publicKey.toBuffer(), Uint8Array.from([nonce])],
        program.programId
      );

      const tx = await program.methods
        .createHabit(habitName, nonce)
        .accounts({
          habit: pda,
          owner: publicKey,
          systemProgram: anchor.SystemProgram.programId,
        })
        .rpc();

      // Save locally for listing
      const saved = JSON.parse(localStorage.getItem("habits") || "[]");
      saved.push({ name: habitName, nonce });
      localStorage.setItem("habits", JSON.stringify(saved));

      setStatus(`✅ Created. Tx: ${tx}`);
    } catch (err) {
      setStatus("Error: " + err.toString());
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "3rem", // Maintain original padding for internal card spacing
        paddingTop: "2rem",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2
          style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "#333" }}
        >
          Create a New Habit
        </h2>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Start tracking a new habit on the blockchain. Every check-in is
          permanent!
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Habit Name
          </label>
          <input
            type="text"
            placeholder="e.g., Morning Workout, Read 30 Minutes..."
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            maxLength={50}
            disabled={isLoading || !publicKey}
            style={{
              width: "100%",
              padding: "1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
          <div
            style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#999" }}
          >
            {habitName.length}/50 characters
          </div>
        </div>

        {/* Display Status Message */}
        {status && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: status.startsWith("Error")
                ? "#fee2e2"
                : "#d1fae5",
              color: status.startsWith("Error") ? "#991b1b" : "#065f46",
              textAlign: "center",
            }}
          >
            {status}
          </div>
        )}

        <button
          onClick={createHabit}
          disabled={isLoading || !habitName || !publicKey}
          className="gradient-button"
          style={{
            width: "100%",
            padding: "1.25rem",
            background: isLoading
              ? "#ccc"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor:
              isLoading || !habitName || !publicKey ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            opacity: isLoading || !habitName || !publicKey ? 0.6 : 1,
          }}
        >
          {isLoading ? "⏳ Creating..." : "🚀 Create Habit"}
        </button>

        {!publicKey && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              color: "#92400e",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            ⚠️ Please connect your wallet first
          </div>
        )}
      </div>
    </div>
  );
}
