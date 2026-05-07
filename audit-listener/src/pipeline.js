import fs from "fs";
import { CONFIG } from "./config.js";

export function validateEvent(event) {
  const result = {
    timestamp: Date.now(),
    event,
    status: "PASS",
    violations: [],
  };

  // AUDIT SPECIFICATION RULE 4.1: DEX SWAP FEE = 0.5%
  if (event.event === "SwapExecuted") {
    try {
      const volume = BigInt(event.args.amountIn);
      const fee = BigInt(event.args.fee);
      const expectedFee = volume * 50n / 10000n; // 50 basis points = 0.5%

      if (fee !== expectedFee) {
        result.status = "FAIL";
        result.violations.push({
          rule: "DEX_FEE_RATIO",
          expected: expectedFee.toString(),
          actual: fee.toString()
        });
      }
    } catch (err) {
      result.status = "INVALID";
      result.violations.push("NUMERIC_OVERFLOW");
    }
  }

  // AUDIT SPECIFICATION RULE 4.2: NFT ROYALTY = 2.5%
  if (event.event === "RoyaltyPaid") {
    const salePrice = BigInt(event.args.salePrice);
    const royalty = BigInt(event.args.amount);
    const expectedRoyalty = salePrice * 250n / 10000n; // 250 basis points = 2.5%

    if (royalty !== expectedRoyalty) {
      result.status = "FAIL";
      result.violations.push({
        rule: "NFT_ROYALTY_RATIO",
        expected: expectedRoyalty.toString(),
        actual: royalty.toString()
      });
    }
  }

  // AUDIT SPECIFICATION RULE 4.3: STAKING FEE = 1%
  if (event.event === "ProtocolFeeDeducted") {
    const totalReward = BigInt(event.args.totalReward);
    const fee = BigInt(event.args.amount);
    const expectedFee = totalReward * 1n / 100n;

    if (fee !== expectedFee) {
      result.status = "FAIL";
      result.violations.push({
        rule: "STAKING_FEE_RATIO",
        expected: expectedFee.toString(),
        actual: fee.toString()
      });
    }
  }

  return result;
}

export function writeAuditLog(entry) {
  const logLine = JSON.stringify(entry) + "\n";
  fs.appendFileSync(CONFIG.LOG_FILE, logLine);
}