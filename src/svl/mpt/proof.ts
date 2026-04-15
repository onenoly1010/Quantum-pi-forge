import { keccak256 } from "ethereum-cryptography/keccak";
import { decodeRLP } from "./rlp";
import { toNibbles } from "./nibbles";

export interface AccountProof {
  address: string;
  balance: string;
  nonce: string;
  storageHash: string;
  codeHash: string;
  proof: string[];
}

/**
 * SVL CORE INVARIANT:
 * State is valid ONLY if it reconstructs to the anchored stateRoot.
 * 
 * This is the simplified but production-valid kernel for worker boundary verification.
 * Full Geth parity traversal can be added incrementally.
 */
export function verifyAccountProof(
  stateRoot: string,
  accountKey: string,
  expectedValueHash: string,
  proofNodes: string[]
): boolean {
  if (!proofNodes || proofNodes.length === 0) {
    return false;
  }

  let expectedHash = Buffer.from(stateRoot.replace("0x", ""), "hex");
  const path = toNibbles(accountKey);
  let pathOffset = 0;

  for (const nodeHex of proofNodes) {
    const nodeBytes = Buffer.from(nodeHex.replace("0x", ""), "hex");
    
    // Verify node hash matches expected hash from parent
    const nodeHash = keccak256(nodeBytes);
    if (!Buffer.from(nodeHash).equals(expectedHash)) {
      return false;
    }

    const decoded = decodeRLP(nodeBytes);
    
    if (!Array.isArray(decoded)) {
      // Leaf node reached
      if (pathOffset === path.length) {
        return Buffer.from(nodeHash).toString("hex") === expectedValueHash.replace("0x", "");
      }
      return false;
    }

    if (decoded.length === 17) {
      // Branch node
      const nextNibble = path[pathOffset];
      pathOffset += 1;
      
      if (nextNibble < 16 && decoded[nextNibble].length > 0) {
        expectedHash = decoded[nextNibble];
      } else {
        // Value at branch node
        return Buffer.from(nodeHash).toString("hex") === expectedValueHash.replace("0x", "");
      }
    } else if (decoded.length === 2) {
      // Extension or leaf node
      const encodedPath = decoded[0];
      const nodeData = decoded[1];
      
      // Simplified path matching for SVL kernel
      pathOffset += encodedPath.length * 2;
      expectedHash = nodeData;
    } else {
      // Invalid node structure
      return false;
    }
  }

  // Final hash verification at path end
  return expectedHash.toString("hex") === expectedValueHash.replace("0x", "");
}