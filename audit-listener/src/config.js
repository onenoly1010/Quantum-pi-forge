import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  RPC_ENDPOINTS: [
    process.env.RPC_PRIMARY,
    process.env.RPC_SECONDARY,
    process.env.RPC_TERTIARY,
  ].filter(Boolean),
  CHAIN_ID: parseInt(process.env.CHAIN_ID),
  DEX_CONTRACT: process.env.DEX_CONTRACT,
  LOG_FILE: process.env.LOG_FILE || "./logs/audit.log",
  MAX_RPC_FAILURES: parseInt(process.env.MAX_RPC_FAILURES) || 3
};
