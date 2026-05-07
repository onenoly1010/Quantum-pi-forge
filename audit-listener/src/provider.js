import { ethers } from "ethers";
import { CONFIG } from "./config.js";

export const provider = new ethers.WebSocketProvider(CONFIG.RPC_WSS);

provider.on("error", (error) => {
  console.error(`WebSocket provider error: ${error.message}`);
  setTimeout(() => process.exit(1), 5000);
});

provider.on("debug", (info) => {
  if (info.action === "sendWebSocketPayload") return;
  console.debug(`Provider debug: ${info.action}`);
});