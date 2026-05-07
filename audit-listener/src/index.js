import { startListener } from "./listener.js";

process.on('SIGINT', () => {
  console.log("\n🛑 Gracefully shutting down audit listener");
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error(`💀 Uncaught exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

startListener();