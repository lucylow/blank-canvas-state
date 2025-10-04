#!/usr/bin/env node

// packages/cli/src/index.ts
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";

// packages/core/src/index.ts
var CompatGuardLinter = class {
  constructor(targetBaseline = "2024", options = {}) {
    this.targetBaseline = targetBaseline;
    this.options = options;
    this.stats = { checks: 0 };
    this.initialized = false;
  }
  async initialize() {
    this.initialized = true;
    return;
  }
  async lintCode(code, fileType = "javascript", opts = {}) {
    this.stats.checks++;
    const diagnostics = [];
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.includes("IntersectionObserver")) {
        diagnostics.push({ severity: "warning", message: "IntersectionObserver detected", location: { line: i + 1 } });
      }
      if (l.includes(":has(") || l.includes("color-mix(")) {
        diagnostics.push({ severity: "warning", message: "Modern CSS feature detected", location: { line: i + 1 } });
      }
    }
    return { diagnostics, stats: this.stats };
  }
  getStats() {
    return this.stats;
  }
};

// packages/cli/src/index.ts
var program = new Command();
program.name("compatguard").version("1.0.0");
program.command("lint <paths...>").option("-b, --baseline <year>", "Target baseline", "2024").option("--fix", "Attempt auto-fix", false).description("Lint files for Baseline compatibility").action(async (paths, opts) => {
  console.log("\u{1F50D} CompatGuard CLI - lint", paths, opts);
  const linter = new CompatGuardLinter(opts.baseline);
  await linter.initialize();
  for (const p of paths) {
    try {
      const content = await fs.readFile(p, "utf-8");
      const res = await linter.lintCode(content, "javascript", {});
      console.log(`Results for ${p}:`, res.diagnostics.length, "diagnostics");
    } catch (e) {
      if (e instanceof Error) {
        console.warn("Skipping", p, e.message);
      } else {
        console.warn("Skipping", p, e);
      }
    }
  }
});
program.command("init").description("Write example .compatguardrc.json").action(async () => {
  const cfg = { targetBaseline: "2024", frameworks: ["react", "vue", "svelte"] };
  await fs.writeFile(path.resolve(".compatguardrc.json"), JSON.stringify(cfg, null, 2));
  console.log("Wrote .compatguardrc.json");
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map