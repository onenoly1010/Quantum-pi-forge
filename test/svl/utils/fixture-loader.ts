import fs from "fs";
import path from "path";

export function loadFixture(name: string) {
  const filePath = path.join(__dirname, "../fixtures/geth-trie", name);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}