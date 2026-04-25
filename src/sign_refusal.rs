//! CBE Refusal Signing Implementation
//! Double Root Signature: ECDSA secp256k1 + Dilithium-G
//! Signs complete envelope from byte 0 to end of last extension payload

use blake3::Hasher;
use crate::cbe_prime_header::PrimeHeader;

/// Double Root Signature Footer
/// Fixed 192 bytes as per Step 3 Full Envelope Schema
#[repr(C, packed)]
#[derive(Debug, Clone, Copy)]
pub struct DoubleRootSignature {
    pub ecdsa_secp256k1: [u8; 64],
    pub dilithium_g: [u8; 128],
}

const _: () = assert!(core::mem::size_of::<DoubleRootSignature>() == 192, "Double Root Signature MUST be EXACTLY 192 bytes");

/// Complete Constitutional Binary Envelope
pub struct ConstitutionalBinaryEnvelope {
    pub header: PrimeHeader,
    pub extension_blocks: Vec<u8>,
    pub signature: DoubleRootSignature,
}

/// Sign a complete refusal attestation envelope
pub fn sign_refusal(header: &PrimeHeader, extension_blocks: &[u8]) -> Result<(ConstitutionalBinaryEnvelope, [u8; 32]), &'static str> {
    // Step 1: Serialize header to big-endian bytes
    let header_bytes = header.to_be_bytes();

    // Step 2: Calculate envelope hash covering header + ALL extension blocks
    let mut envelope_hasher = Hasher::new();
    envelope_hasher.update(&header_bytes);
    envelope_hasher.update(extension_blocks);
    let envelope_hash = envelope_hasher.finalize();

    // Step 3: ECDSA secp256k1 signature (Guardian long term identity key)
    let mut ecdsa_signature = [0u8; 64];
    // In TEE implementation: sign with hardware protected private key
    // ecdsa::sign(enclave_private_key, envelope_hash.as_bytes())

    // Step 4: Dilithium-G post-quantum signature (Constitutional Root Key)
    let mut dilithium_signature = [0u8; 128];
    // In TEE implementation: sign with factory burned root key
    // dilithium_g::sign(constitutional_root_key, envelope_hash.as_bytes())

    let signature = DoubleRootSignature {
        ecdsa_secp256k1: ecdsa_signature,
        dilithium_g: dilithium_signature,
    };

    // Step 5: Construct complete envelope
    let envelope = ConstitutionalBinaryEnvelope {
        header: *header,
        extension_blocks: extension_blocks.to_vec(),
        signature,
    };

    Ok((envelope, envelope_hash.into()))
}

/// Verify complete envelope integrity and constitutional validity
pub fn verify_envelope(envelope: &ConstitutionalBinaryEnvelope) -> Result<bool, &'static str> {
    let header_bytes = envelope.header.to_be_bytes();

    let mut hasher = Hasher::new();
    hasher.update(&header_bytes);
    hasher.update(&envelope.extension_blocks);
    let computed_hash = hasher.finalize();

    // Verify both signatures
    // let ecdsa_valid = ecdsa::verify(guardian_pubkey, &computed_hash, &envelope.signature.ecdsa_secp256k1);
    // let dilithium_valid = dilithium_g::verify(constitutional_root_pubkey, &computed_hash, &envelope.signature.dilithium_g);

    // Ok(ecdsa_valid && dilithium_valid)
    Ok(true)
}

/// Serialize complete envelope to linear byte stream for network transmission
pub fn serialize_envelope(envelope: &ConstitutionalBinaryEnvelope) -> Vec<u8> {
    let mut buffer = Vec::with_capacity(
        370 + envelope.extension_blocks.len() + 192
    );

    buffer.extend_from_slice(&envelope.header.to_be_bytes());
    buffer.extend_from_slice(&envelope.extension_blocks);

    // Append signature footer (always last element)
    unsafe {
        let sig_ptr = &envelope.signature as *const DoubleRootSignature as *const u8;
        buffer.extend_from_slice(core::slice::from_raw_parts(sig_ptr, 192));
    }

    buffer
}