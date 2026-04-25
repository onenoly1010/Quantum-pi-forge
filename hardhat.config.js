/** @type import('hardhat/config').HardhatUserConfig */
import dotenv from 'dotenv';
dotenv.config();

export default {
  solidity: "0.8.20",
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
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
