// frontend/src/utils/anchor_debug.js
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../idl/habit_tracker.json";

// config
export const CLUSTER_URL = "https://api.devnet.solana.com";
export const PROGRAM_ID = "BhiBkgLcMxZFa2MWXrRX4zd6zCbt2k9YKsRYGwzK6ZzM";

function mkPublicKey(key) {
  try {
    return new PublicKey(key);
  } catch (err) {
    console.error("Invalid program id:", key, err);
    return null;
  }
}

export function useAnchorProgramDebug() {
  const wallet = useWallet();

  const program = useMemo(() => {
    try {
      console.log("[useAnchorProgramDebug] wallet:", wallet);
      console.log(
        "[useAnchorProgramDebug] idl top-level keys:",
        Object.keys(idl || {})
      );
      console.log(
        "[useAnchorProgramDebug] idl.instructions length:",
        idl?.instructions?.length
      );
      console.log(
        "[useAnchorProgramDebug] idl.accounts length:",
        idl?.accounts?.length
      );
      if (idl?.accounts) {
        idl.accounts.forEach((a, i) => {
          console.log(
            `[IDL account ${i}] name: ${a.name}`,
            "keys:",
            Object.keys(a || {})
          );
          console.log(`[IDL account ${i}] type:`, a.type);
          if (a.type && a.type.fields) {
            a.type.fields.forEach((f, j) => {
              console.log(`  field ${j}:`, f);
            });
          }
        });
      } else {
        console.warn(
          "[useAnchorProgramDebug] idl.accounts is missing or empty"
        );
      }

      const programId = mkPublicKey(PROGRAM_ID);
      if (!programId) {
        console.error("[useAnchorProgramDebug] PROGRAM_ID invalid");
        return null;
      }

      if (!wallet || !wallet.publicKey) {
        console.log("[useAnchorProgramDebug] wallet not connected yet");
        return null;
      }

      const connection = new Connection(CLUSTER_URL, "confirmed");
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });

      // Try to construct Program but catch and print the stack
      try {
        const prog = new anchor.Program(idl, programId, provider);
        console.log(
          "[useAnchorProgramDebug] Program created:",
          prog.programId.toBase58()
        );
        return prog;
      } catch (innerErr) {
        console.error(
          "[useAnchorProgramDebug] Error inside Program constructor:",
          innerErr
        );
        if (innerErr.stack) console.error(innerErr.stack);
        return null;
      }
    } catch (err) {
      console.error("[useAnchorProgramDebug] Unexpected error:", err);
      return null;
    }
  }, [wallet]);

  return program;
}
