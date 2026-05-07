import { ethers } from "ethers";
import { CONFIG } from "./config.js";

export function createProviderPool() {
  return CONFIG.RPC_ENDPOINTS.map((url, index) => {
    const provider = new ethers.WebSocketProvider(url);

    const wrapper = {
      id: index,
      url: url.substring(0, 28) + "...",
      provider,
      healthy: true,
      failures: 0,
      lastBlock: 0,
      connected: false
    };

    return wrapper;
  });
}
