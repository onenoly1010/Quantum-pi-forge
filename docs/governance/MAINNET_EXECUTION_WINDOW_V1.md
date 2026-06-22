# Mainnet Execution Window v1

This opens a single-use execution window for the approved final command.

Approved final command:
```bash
npm run autonomous:v2-mainnet-cutover:execute -- --require-command-hash --receipt receipts/execution/v2-mainnet-cutover-execution-v1.json
```

This receipt does not automatically execute the command. A post-execution result receipt is required after the command attempt.
