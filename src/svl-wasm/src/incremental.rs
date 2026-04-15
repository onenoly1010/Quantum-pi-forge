use wasm_bindgen::prelude::*;
use sha3::{Digest, Keccak256};

#[wasm_bindgen]
pub struct IncrementalVerifier {
    last_root: String,
    window: Vec<String>, // verified node hashes
}

#[wasm_bindgen]
impl IncrementalVerifier {
    pub fn new(initial_root: &str) -> Self {
        Self {
            last_root: initial_root.to_string(),
            window: Vec::new(),
        }
    }

    pub fn apply_delta(&mut self, delta: &[u8], proof_chunk: &[u8]) -> bool {
        // 1. Hash delta to get node hash
        let node_hash = hex::encode(Keccak256::digest(delta));
        
        // 2. Verify that node_hash is in the current window (or connects to last_root)
        let mut current = match hex::decode(&self.last_root) {
            Ok(v) => v,
            Err(_) => return false,
        };
        
        for chunk in proof_chunk.chunks(32) {
            let mut hasher = Keccak256::new();
            hasher.update(&current);
            hasher.update(chunk);
            current = hasher.finalize();
        }
        let computed_root = hex::encode(current);
        
        if computed_root != self.last_root {
            return false;
        }
        
        // 3. Accept delta, update window
        self.window.push(node_hash);
        if self.window.len() > 100 {
            self.window.remove(0);
        }
        true
    }
    
    pub fn finalize_root(&mut self, new_root: &str) -> bool {
        self.last_root = new_root.to_string();
        true
    }
}