import React, { useState } from "react";
import { useAnchorProgram } from "../utils/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchorWeb from "@solana/web3.js";

export default function CheckIn({ pda, nonce }) {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const [status, setStatus] = useState("");

  const doCheckIn = async () => {
    if (!program || !publicKey) {
      setStatus("Connect wallet");
      return;
    }

    try {
      setStatus("Checking in...");
      const tx = await program.methods
        .checkIn(nonce)
        .accounts({
          habit: new anchorWeb.PublicKey(pda),
          owner: publicKey,
        })
        .rpc();
      setStatus(`Done. Tx: ${tx}`);
    } catch (err) {
      setStatus("Error: " + err.toString());
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 6 }}>
      <button onClick={doCheckIn}>Check In</button>
      <span style={{ marginLeft: 8 }}>{status}</span>
    </div>
  );
}
