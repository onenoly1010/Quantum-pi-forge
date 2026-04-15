let wasm: any;

export async function loadSVL() {
  if (!wasm) {
    wasm = await import("../../pkg/svl_wasm.js");
  }
  return wasm;
}

export async function verifyWithWASM(root: string, path: Uint8Array, value: Uint8Array, proof: Uint8Array) {
  const svl = await loadSVL();

  return svl.verify_state_root(
    root,
    path,
    value,
    proof
  );
}