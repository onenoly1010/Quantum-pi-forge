export async function executeGuardianRegistration(contract, signer) {
  const tx = await contract.connect(signer).register();

  console.log("⏳ Pending:", tx.hash);

  const receipt = await tx.wait();

  console.log("✅ Confirmed:", receipt.transactionHash);

  return receipt;
}