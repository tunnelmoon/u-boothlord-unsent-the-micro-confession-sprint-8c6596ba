// Unsent: The Micro-Confession Sprint (u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)
// A message typed once, kept in drafts, never sent: a To: line naming who it
// was meant for, and the unsent message itself, one line exactly as typed.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "To: my brother\n" +
  "i was the one who broke your guitar, not the dog. i let you blame him for four years.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// Gate: UTF-8 text of 1 to 260 characters, not only white space.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 260) {
  throw new Error(`entry is ${chars} characters, must be 1 to 260`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  throw new Error(`entry must be exactly 2 lines, got ${lines.length}`);
}
if (!lines[0].startsWith("To: ")) {
  throw new Error("first line must be a To: line");
}
if (lines[1].trim().length === 0 || lines[1].trim() !== lines[1]) {
  throw new Error("message line must be a single non-empty typed line");
}
// The entry is exactly its two lines: no trailing newline, no control
// characters other than the one separator between the two lines.
if (ENTRY.endsWith("\n")) {
  throw new Error("entry must not end with a newline");
}
for (const ch of ENTRY) {
  const code = ch.codePointAt(0);
  if (code !== 0x0a && code !== undefined && code < 0x20) {
    throw new Error("entry must not contain control characters");
  }
}
if ([...lines[1]].length > 200) {
  throw new Error("message line must be at most 200 characters");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip read-back check: what was written must read back identical.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("round-trip read-back mismatch");
}
