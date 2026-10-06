#!/usr/bin/env node
/** Install the packed library outside this repository and check exports. */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const archive = resolve(process.argv[2] ?? "");
if (!existsSync(archive)) {
  throw new Error(`Design package not found: ${archive}`);
}

const consumer = mkdtempSync(join(tmpdir(), "pq-design-consumer-"));
const terminalHash = createHash("sha256")
  .update(readFileSync(new URL("../python/pq_terminal.py", import.meta.url)))
  .digest("hex");
try {
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({ name: "pq-design-smoke", private: true, type: "module" }),
  );
  execFileSync(
    "npm",
    ["install", archive, "react@19", "react-dom@19", "lucide-react@0.468"],
    { cwd: consumer, stdio: "inherit" },
  );
  execFileSync(
    "node",
    [
      "--input-type=module",
      "-e",
      `import { existsSync, readFileSync } from "node:fs";
       import { createHash } from "node:crypto";
       import { createRequire } from "node:module";
       import { createElement } from "react";
       import { renderToStaticMarkup } from "react-dom/server";
       import { Field, Modal } from "@molarverse/pq-design";
       const require = createRequire(import.meta.url);
       if (typeof Field !== "function" || typeof Modal !== "function") {
         throw new Error("React controls are unavailable");
       }
       const markup = renderToStaticMarkup(
         createElement(Field, { label: "Input" }, createElement("input", { type: "text" })),
       );
       if (!markup.includes("Input") || !markup.includes("<input")) {
         throw new Error("Packed React control did not render");
       }
       for (const name of ["styles.css", "tokens.css", "tokens.json", "terminal.py"]) {
         if (!existsSync(require.resolve("@molarverse/pq-design/" + name))) {
           throw new Error(name + " is unavailable");
         }
       }
       const terminal = readFileSync(require.resolve("@molarverse/pq-design/terminal.py"));
       if (createHash("sha256").update(terminal).digest("hex") !== "${terminalHash}") {
         throw new Error("Packed Python renderer differs from the tested source");
       }`,
    ],
    { cwd: consumer, stdio: "inherit" },
  );
} finally {
  rmSync(consumer, { recursive: true, force: true });
}

console.log(`Verified independent install of ${archive}`);
