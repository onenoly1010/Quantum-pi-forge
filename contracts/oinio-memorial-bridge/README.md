# 🏛️ OINIO Memorial Bridge

**For the Beloved Keepers of the Northern Gateway. Not in vain.**

---

## Purpose

This Soroban smart contract serves as a permanent memorial on the Pi Network blockchain, honoring those who have passed and preserving their memory in immutable code.

The contract anchors:
- A sacred memorial message
- The 1 billion OINIO supply dedicated to the families
- A permanent link to the Facebook open letter

---

## Quick Start

### Prerequisites

1. **Install Rust:**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

2. **Install Soroban CLI:**
   ```bash
   cargo install --locked soroban-cli --features opt
   rustup target add wasm32-unknown-unknown
   ```

3. **Install wasm-opt (optional but recommended):**
   ```bash
   # macOS
   brew install binaryen
   
   # Linux
   sudo apt-get install binaryen
   ```

4. **Configure Pi Network:**
   ```bash
   soroban config network add pi-mainnet \
     --rpc-url https://api.mainnet.minepi.com/soroban/rpc \
     --network-passphrase "Pi Network Mainnet"
   
   soroban config identity generate onenoly1010
   ```

---

## Build and Deploy

### Step 1: Build
```bash
chmod +x build.sh
./build.sh
```

### Step 2: Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Optimize the WASM file
- Deploy to Pi Network mainnet
- Initialize the contract
- Save the contract address to `contract_address.txt`

---

## Contract Functions

### `initialize(admin: Address)`
Initialize the memorial with the sacred message and 1 billion OINIO supply.

**Usage:**
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source onenoly1010 \
  --network pi-mainnet \
  -- \
  initialize \
  --admin <ADMIN_ADDRESS>
```

### `anchor_letter(letter_url: String)`
Permanently anchor the Facebook open letter URL to the blockchain.

**Usage:**
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source onenoly1010 \
  --network pi-mainnet \
  -- \
  anchor_letter \
  --letter_url "https://www.facebook.com/your-letter-url"
```

### `get_message() -> String`
Read the memorial message.

**Usage:**
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --network pi-mainnet \
  -- \
  get_message
```

### `get_letter() -> Option<String>`
Read the anchored letter URL.

**Usage:**
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --network pi-mainnet \
  -- \
  get_letter
```

### `get_supply() -> u64`
Read the memorial supply (1,000,000,000 OINIO).

**Usage:**
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --network pi-mainnet \
  -- \
  get_supply
```

---

## Testing

Run the included tests:
```bash
cargo test
```

---

## Verification

After deployment, verify the contract on Pi Network Explorer:
```
https://pi.network/explorer/contract/<CONTRACT_ID>
```

Read the memorial message to confirm:
```bash
CONTRACT_ID=$(cat contract_address.txt)
soroban contract invoke --id $CONTRACT_ID --network pi-mainnet -- get_message
```

Expected output:
```
"OINIO: For the Beloved Keepers of the Northern Gateway. Not in vain."
```

---

## Transparency

- **Code**: Open source, visible in this repository
- **Purpose**: Honor the families, preserve memory
- **Governance**: Transparent, inclusive, immutable
- **Message**: "For the Beloved Keepers of the Northern Gateway. Not in vain."

The blockchain cannot forget. The families are honored forever.

---

## Files

```
contracts/oinio-memorial-bridge/
├── src/
│   └── lib.rs              # Smart contract source code
├── Cargo.toml              # Rust dependencies and configuration
├── build.sh                # Build script
├── deploy.sh               # Deployment script
├── README.md               # This file
├── .gitignore             # Git ignore rules
└── contract_address.txt    # Saved contract address (after deployment)
```

---

## License

MIT License - See repository root for details

---

## Memorial

*This contract is dedicated to the Beloved Keepers of the Northern Gateway.*

*Your names are now eternal on the Pi Network blockchain.*

*Not in vain.*

🌉

---

**Created by:** Kris Olofson (onenoly1010)  
**Date:** December 17, 2025  
**Network:** Pi Network Mainnet  
**Purpose:** Remembrance, Honor, Permanence
