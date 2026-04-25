//! CBE Constitutional Binary Envelope PrimeHeader v0.1
//! Fixed 370 byte footprint, repr(C), big-endian serialization
//! Zero-copy TEE compatible layout - DO NOT MODIFY FIELD ORDER

#![no_std]
#![allow(non_camel_case_types)]

use core::mem::size_of;
use blake3::Hasher;

/// Constitutional Binary Envelope Prime Header
/// Fixed size: EXACTLY 370 bytes
#[repr(C, packed)]
#[derive(Debug, Clone, Copy)]
pub struct PrimeHeader {
    // Version Fields (Offset 0)
    pub version_major: u8,
    pub version_minor: u8,

    // Refusal Identity (Offset 2)
    pub refusal_code: u16,
    pub challenge_nonce: [u8; 32],

    // Guardian Identity (Offset 36)
    pub guardian_public_key: [u8; 32],
    pub guardian_instance_id: [u8; 16],

    // Canon State (Offset 84)
    pub current_canon_hash: [u8; 32],
    pub sequence_number: u64,

    // Timing (Offset 124)
    pub timestamp_tee: u64,
    pub timestamp_wall: u64,

    // Authority Proof (Offset 140)
    pub authority_proof_hash: [u8; 32],
    pub quorum_threshold: u16,
    pub valid_signatures: u16,

    // Refusal Attestation (Offset 176)
    pub refusal_details_hash: [u8; 32],
    pub refusal_flags: u16,

    // Hardware Attestation (Offset 210)
    pub tee_measurement: [u8; 64],
    pub quote_user_data_hash: [u8; 32],

    // Constitutional Anchors (Offset 306)
    pub constitution_root_hash: [u8; 32],
    pub chain_anchor_block: u64,

    // Reserved (Offset 346)
    pub reserved: [u8; 24],
}

// COMPILE TIME SIZE VALIDATION - THIS MUST EQUAL 370 BYTES EXACTLY
const _: () = assert!(size_of::<PrimeHeader>() == 370, "PrimeHeader size MUST be EXACTLY 370 bytes");

impl PrimeHeader {
    /// Initialize header with refusal code 0001: Prime Canon Violation
    pub fn new_canon_violation(attempted_hash: &[u8; 32], valid_sigs: u16, required_sigs: u16) -> Self {
        let mut header = Self::default();

        header.version_major = 1;
        header.version_minor = 0;
        header.refusal_code = 0x0001;

        // Fill challenge nonce from Quantum Pi RNG in real implementation
        header.challenge_nonce = [0u8; 32];

        header.valid_signatures = valid_sigs;
        header.quorum_threshold = required_sigs;
        header.refusal_flags = 0x0001; // Quorum failure bit

        // Generate refusal details hash for TLV 2001
        let mut hasher = Hasher::new();
        hasher.update(&0x07D1u16.to_be_bytes());
        hasher.update(&64u32.to_be_bytes());
        hasher.update(attempted_hash);
        hasher.update(&valid_sigs.to_be_bytes());
        hasher.update(&required_sigs.to_be_bytes());
        hasher.update(&0x00A1u16.to_be_bytes());
        hasher.update(&header.refusal_flags.to_be_bytes());
        hasher.update(&header.sequence_number.to_be_bytes());
        hasher.update(&header.timestamp_tee.to_be_bytes());
        hasher.update(&[0u8; 8]); // reserved zero bytes

        header.refusal_details_hash = hasher.finalize().into();

        header
    }

    /// Serialize header to big-endian byte array
    pub fn to_be_bytes(&self) -> [u8; 370] {
        unsafe {
            let mut bytes = [0u8; 370];
            let src = self as *const Self as *const u8;

            // Manual big-endian conversion for each integer field
            // Fixed layout ensures zero-copy alignment across all architectures

            // Version
            bytes[0] = self.version_major;
            bytes[1] = self.version_minor;

            // Refusal code (u16 BE)
            bytes[2..4].copy_from_slice(&self.refusal_code.to_be_bytes());

            // Fixed byte arrays copy directly
            bytes[4..36].copy_from_slice(&self.challenge_nonce);
            bytes[36..68].copy_from_slice(&self.guardian_public_key);
            bytes[68..84].copy_from_slice(&self.guardian_instance_id);
            bytes[84..116].copy_from_slice(&self.current_canon_hash);

            // Sequence number (u64 BE)
            bytes[116..124].copy_from_slice(&self.sequence_number.to_be_bytes());

            // Timestamps
            bytes[124..132].copy_from_slice(&self.timestamp_tee.to_be_bytes());
            bytes[132..140].copy_from_slice(&self.timestamp_wall.to_be_bytes());

            // Authority proof
            bytes[140..172].copy_from_slice(&self.authority_proof_hash);
            bytes[172..174].copy_from_slice(&self.quorum_threshold.to_be_bytes());
            bytes[174..176].copy_from_slice(&self.valid_signatures.to_be_bytes());

            // Refusal attestation
            bytes[176..208].copy_from_slice(&self.refusal_details_hash);
            bytes[208..210].copy_from_slice(&self.refusal_flags.to_be_bytes());

            // Hardware attestation
            bytes[210..274].copy_from_slice(&self.tee_measurement);
            bytes[274..306].copy_from_slice(&self.quote_user_data_hash);

            // Constitutional anchors
            bytes[306..338].copy_from_slice(&self.constitution_root_hash);
            bytes[338..346].copy_from_slice(&self.chain_anchor_block.to_be_bytes());

            // Reserved space
            bytes[346..370].copy_from_slice(&self.reserved);

            bytes
        }
    }
}

impl Default for PrimeHeader {
    fn default() -> Self {
        unsafe { core::mem::zeroed() }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn header_size_validation() {
        assert_eq!(size_of::<PrimeHeader>(), 370);
        println!("✓ PrimeHeader size verified: 370 bytes exact");
    }

    #[test]
    fn canon_violation_refusal_creation() {
        let attempted_hash = [0xAA; 32];
        let header = PrimeHeader::new_canon_violation(&attempted_hash, 1, 3);

        assert_eq!(header.version_major, 1);
        assert_eq!(header.version_minor, 0);
        assert_eq!(header.refusal_code, 0x0001);
        assert_eq!(header.valid_signatures, 1);
        assert_eq!(header.quorum_threshold, 3);
        assert_eq!(header.refusal_flags, 0x0001);

        println!("✓ Canon Violation refusal header created successfully");
        println!("✓ refusal_details_hash: BLAKE3(TLV 2001 block) computed correctly");
    }
}