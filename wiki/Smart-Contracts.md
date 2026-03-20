# 📜 Smart Contracts

While the core logic resides in the Python lattice, the Pi Forge Quantum Genesis interacts with blockchain concepts.

## Pi Network Integration

Currently, the system relies on the **Pi Network SDK** for payments. This is an off-chain integration with the Pi Network servers, but it mimics smart contract behavior:
*   **Atomic Transactions:** Payments are either completed or failed.
*   **Metadata:** Transaction metadata is stored immutably in the `payment_records` table.

## Future Roadmap: Solidity

We are exploring the deployment of actual smart contracts for:
*   **Resonance Token (RES):** An ERC-20 token representing resonance.
*   **Guardian DAO:** On-chain governance for the Veto Triad.

*See `contracts/` directory for experimental Solidity code.*
