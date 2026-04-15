import initWasm, { StreamingVerifier } from "../../pkg/svl_wasm";

type ProofTask = {
  leaf: Uint8Array;
  proof: Uint8Array;
};

export class FanoutOrchestrator {
  private concurrency: number;

  constructor(concurrency = 6) {
    this.concurrency = concurrency;
  }

  async verifyAll(
    stateRoot: string,
    tasks: ProofTask[],
  ): Promise<{ ok: boolean; failedIndex?: number }> {
    await initWasm();

    const verifier = new StreamingVerifier(stateRoot);

    let index = 0;
    let active: Promise<boolean>[] = [];

    const runTask = (task: ProofTask) => {
      return Promise.resolve(
        verifier.verify_segment(task.leaf, task.proof)
      );
    };

    while (index < tasks.length || active.length > 0) {

      while (active.length < this.concurrency && index < tasks.length) {
        active.push(runTask(tasks[index]));
        index++;
      }

      const results = await Promise.allSettled(active);
      active = [];

      for (const r of results) {
        if (r.status === "rejected" || r.value === false) {
          return { ok: false, failedIndex: index };
        }
      }
    }

    return { ok: true };
  }
}