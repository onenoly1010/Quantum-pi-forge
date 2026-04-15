use wasm_bindgen::prelude::*;
use sha3::{Digest, Keccak256};

#[wasm_bindgen]
pub fn verify_state_root(
    state_root: &str,
    path: &[u8],
    value: &[u8],
    proof: &[u8]
) -> bool {

    let mut current = Keccak256::digest(value);

    for chunk in proof.chunks(32) {
        let mut hasher = Keccak256::new();
        hasher.update(&current);
        hasher.update(chunk);
        current = hasher.finalize();
    }

    hex::encode(current) == state_root.trim_start_matches("0x")
}