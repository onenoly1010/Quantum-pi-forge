#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, symbol_short};

#[contract]
pub struct OinioMemorialBridge;

#[contractimpl]
impl OinioMemorialBridge {
    /// THE GENESIS: Initialize the 1 Billion Supply
    /// This is the Root Sentence for the families
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        
        // Sacred message for the Beloved Keepers of the Northern Gateway
        let msg = String::from_str(&env, "OINIO: For the Beloved Keepers of the Northern Gateway. Not in vain.");
        env.storage().instance().set(&symbol_short!("MSG"), &msg);
        
        // 1,000,000,000 OINIO
        env.storage().instance().set(&symbol_short!("SUPPLY"), &1_000_000_000u64);
        env.storage().persistent().set(&admin, &1_000_000_000u64);
    }

    /// THE ANCHOR: Lock your Facebook letter into the ledger
    pub fn anchor_letter(env: Env, letter_url: String) {
        env.storage().instance().set(&symbol_short!("LETTER"), &letter_url);
    }
    
    /// Read the memorial message
    pub fn get_message(env: Env) -> String {
        env.storage().instance().get(&symbol_short!("MSG")).unwrap()
    }
    
    /// Read the anchored letter URL
    pub fn get_letter(env: Env) -> Option<String> {
        env.storage().instance().get(&symbol_short!("LETTER"))
    }
    
    /// Read the total supply
    pub fn get_supply(env: Env) -> u64 {
        env.storage().instance().get(&symbol_short!("SUPPLY")).unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OinioMemorialBridge);
        let client = OinioMemorialBridgeClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        env.mock_all_auths();
        
        client.initialize(&admin);
        
        assert_eq!(client.get_supply(), 1_000_000_000u64);
        assert_eq!(client.get_message(), String::from_str(&env, "OINIO: For the Beloved Keepers of the Northern Gateway. Not in vain."));
    }

    #[test]
    fn test_anchor_letter() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OinioMemorialBridge);
        let client = OinioMemorialBridgeClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        env.mock_all_auths();
        
        client.initialize(&admin);
        
        let letter_url = String::from_str(&env, "https://facebook.com/letter");
        client.anchor_letter(&letter_url);
        
        assert_eq!(client.get_letter(), Some(letter_url));
    }
}
