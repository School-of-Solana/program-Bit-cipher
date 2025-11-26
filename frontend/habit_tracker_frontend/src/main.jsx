import { Buffer } from "buffer";
window.Buffer = Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WalletProviderWrapper } from "./walletProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <WalletProviderWrapper> */}
    <App />
    {/* </WalletProviderWrapper> */}
  </StrictMode>
);
