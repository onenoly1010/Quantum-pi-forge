/** @type import('hardhat/config').HardhatUserConfig */
import dotenv from 'dotenv';
dotenv.config();

export default {
  solidity: {
    compilers: [
      { version: "0.5.16" },
      { version: "0.6.6" },
      {
        version: "0.8.24",
        settings: {
          evmVersion: "cancun"
        }
      }
    ],
    overrides: {
      "contracts/src/OINIOToken.sol": {
        version: "0.8.24",
        settings: { evmVersion: "cancun" }
      },
      "contracts/src/OINIOModelRegistry.sol": {
        version: "0.8.24",
        settings: { evmVersion: "cancun" }
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./hardhat-test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      forking: {
        url: "https://rpc-aristotle.0g.ai",
        blockNumber: 3041227
      }
    },
    "0g-aristotle": {
      type: "http",
      url: "https://rpc-aristotle.0g.ai",
      chainId: 16661,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
