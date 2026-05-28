/** @type import('hardhat/config').HardhatUserConfig */
import dotenv from 'dotenv';
dotenv.config();

const OG_RPC_URL = process.env.OG_RPC_URL || "https://evmrpc.0g.ai";

export default {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          evmVersion: "cancun"
        }
      }
    ]
  },
  paths: {
    sources: "./src",
    tests: "./hardhat-test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      type: "edr-simulated"
    },
    "0g-aristotle": {
      type: "http",
      url: OG_RPC_URL,
      chainId: 16661,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
