export function adaptGethProof(vector: any) {
  return {
    stateRoot: vector.stateRoot,
    path: vector.path,
    value: vector.value,
    proof: vector.proof
  };
}