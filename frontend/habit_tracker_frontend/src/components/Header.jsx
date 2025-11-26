import { Sparkles } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Header() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        // Padding on top/bottom to separate from edges, horizontal padding handles mobile gutters
        padding: "1rem 1.5rem",
        paddingTop: "2rem", // Explicitly add the missing top padding
        margin: "0 auto 0", // No bottom margin, let main-content handle separation
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            background: "white",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={28} color="#667eea" />
        </div>
        <div>
          <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>
            Habit Tracker
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              margin: 0,
              fontSize: "0.9rem",
            }}
          >
            Build consistency on-chain
          </p>
        </div>
      </div>

      <WalletMultiButton
        style={{
          padding: "0.75rem 2rem",
          background: "white",
          color: "#667eea",
          border: "none",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}
