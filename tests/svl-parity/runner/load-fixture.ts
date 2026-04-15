import fs from "fs";
import path from "path";

export function loadFixture(name: string) {
  const file = path.join(__dirname, "../fixtures", name);
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}