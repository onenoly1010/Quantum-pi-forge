# 0G Compute Fine-tuning — Operator Reference v1

**Class:** official compute-network knowledge  
**Official:** https://docs.0g.ai/developer-hub/building-on-0g/compute-network/fine-tuning  
**Reviewed:** 2026-08-16  
**Lane:** contained. **NO GO** — no `login` / `deposit` / `transfer-fund` / `create-task`

```text
fine-tuning sub-account  !=  Direct inference sub-account  !=  Router unified balance
fine-tune job            !=  QPF product  !=  sell-one-verification
LoRA adapter             !=  Docs DEPLOYMENT_SET  !=  OINIO Model Registry
wallet login             !=  authorized
```

Does **not** authorize live compute spend, storage upload, mint, LP, yield, or Pi payment.

---

## What it is

Official **Direct CLI** path (`0g-compute-cli` from `@0gfoundation/0g-compute-ts-sdk`, Node ≥ 22).  
Uploads a JSONL dataset to 0G Storage, trains a **LoRA adapter** (not a full model) on a provider GPU, then delivers an encrypted zip. Same SDK QPF already pins for inference — different **service** and **sub-account**.

Hub starter: `0gfoundation/fine-tuning-example` (already listed; still gated).

---

## Balance rule (increment to P0-A)

| Pool | How you fund it | Pays for |
| --- | --- | --- |
| Router unified | `pc.0g.ai` / Router deposit | Router inference |
| Direct **inference** sub-account | `transfer-fund --provider …` (default / `inference`) | Direct chat / image / STT |
| Direct **fine-tuning** sub-account | `transfer-fund --provider … --service fine-tuning` | Fine-tune jobs only |

`MinimumDepositRequired` on a task means the **fine-tuning** sub-account is empty, not that Router is down.

Docs example deposit: `deposit --amount 3` then `transfer-fund --amount 2 --service fine-tuning`. Wallet `login` required. **Do not run.**

---

## Platform facts (docs only)

| Item | Official now |
| --- | --- |
| CLI | `pnpm i -g @0gfoundation/0g-compute-ts-sdk` → `0g-compute-cli` |
| List | `fine-tuning list-providers` / `list-models` |
| Dataset | `.jsonl` UTF-8; instruction/input/output, chat `messages`, or `text` |
| Config | Fixed 5 keys only: `neftune_noise_alpha`, `num_train_epochs`, `per_device_train_batch_size`, `learning_rate` (decimal, not `2e-4`), `max_steps` |
| Model names | No `Qwen/` prefix: `Qwen2.5-0.5B-Instruct`, `Qwen3-32B` |
| Doc prices | 0.5 0G / M tokens (0.5B) · 4 0G / M tokens (32B) + storage reserve 0.01 / 0.09 0G |
| Example provider (docs table) | `0x940b4a101CaBa9be04b16A7363cafa29C1660B0d` — **not** a QPF contract |
| Output | Encrypted file → decrypt → unzip → `adapter_model.safetensors` + tokenizer |
| Deadline | Acknowledge within **48h** of `Delivered` or lose the model and **30%** of fee |

Fee (docs): `(tokenSize / 1e6) × pricePerMillionTokens × trainEpochs + storageReserve`.

Task states: `Init` → `SettingUp` → `SetUp` → `Training` → `Trained` → `Delivering` → `Delivered` → `UserAcknowledged` → `Finished` (or `Failed`). One in-flight task per provider unless queued.

---

## QPF stance

| Allowed now | Requires separate GO |
| --- | --- |
| Read this page + official docs | `0g-compute-cli login` / `deposit` / `transfer-fund` |
| Keep Router-first inference policy | `fine-tuning create-task` / `upload` |
| Diagnose “empty pool” as the third sub-account | `acknowledge-model` / `decrypt-model` |
| | Selling fine-tunes as a QPF product |

Inference after a LoRA is local (HuggingFace + PEFT) unless a later GO wires it to Router/Direct. That still does not make the adapter identity SoR.

---

**P0-A unchanged:** Router → Direct inference → Ollama. Fine-tuning sits beside that as a **wallet-funded Direct service**, not a fourth default path.
