// src/utils/anchor.js
import { useMemo } from "react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
window.Buffer = Buffer;
// Your IDL
import habitTrackerIdl from "../idl/habit_tracker.json";

// Program ID from your IDL
export const PROGRAM_ID = new PublicKey(
  "BhiBkgLcMxZFa2MWXrRX4zd6zCbt2k9YKsRYGwzK6ZzM"
);

export function useAnchorProgram() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const program = useMemo(() => {
    if (!wallet || !connection) return null;

    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    try {
      // NEW: Pass IDL as object directly
      return new Program(habitTrackerIdl, provider);
    } catch (err) {
      console.error("Failed to construct Program:", err);
      return null;
    }
  }, [wallet, connection]);

  return program;
}

// Helper to derive habit PDA
export function getHabitPda(owner, habitName, habitNonce) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("habit"),
      owner.toBuffer(),
      Buffer.from(habitName),
      Buffer.from([habitNonce]),
    ],
    PROGRAM_ID
  );
}
