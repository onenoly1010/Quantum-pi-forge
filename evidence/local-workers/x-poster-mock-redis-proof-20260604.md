# X Poster Mock Redis Worker Proof

Date: 2026-06-04

Branch:
- evidence/execution-truth-journal

Scope:
- Local-only Redis/BullMQ queue proof.
- Mock X poster worker only.
- No live X posting.
- No wallet signing.
- No on-chain mutation.

Environment:
- REDIS_HOST=localhost
- REDIS_PORT=6379
- X_MODE=mock
- OLLAMA_MODEL=qwen2.5-coder:1.5b
- Redis maxmemory-policy=noeviction
- twitter-api-v2 not installed

Observed dependency state:
- bullmq installed
- ioredis installed
- ollama installed
- ethers installed
- dotenv installed
- twitter-api-v2 intentionally not installed

Observed runtime result:
- Mock worker started successfully through CommonJS runtime copy.
- Worker listened on queue: x-updates.
- Local sealed mock jobs were queued.
- Worker consumed mock job id=1.
- Worker consumed mock job id=2.
- Ollama refinement failed safely with: ollama.chat is not a function.
- Worker fell back to raw mock input.
- Worker completed with: Job forged and aligned.

Ollama package export inspection:
- require('ollama') exposed keys: Ollama, default
- default keys: config, fetch, ongoingStreamedRequests
- This explains why the current worker call shape `ollama.chat(...)` fails.

Conclusion:
Redis/BullMQ queue transport is operational.
The local mock worker path is confirmed.
The worker fails safely when Ollama refinement is unavailable.
Live X posting remains unavailable and unauthorized.

Remaining cleanup:
1. Resolve root ESM vs CommonJS mismatch. Root package uses ESM while workers use require().
2. Update the Ollama adapter call to match the installed package export shape, or use a direct local Ollama HTTP fallback.
3. Keep twitter-api-v2 absent unless live posting is explicitly authorized later.
