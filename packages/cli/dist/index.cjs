#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// packages/cli/src/index.ts
var import_commander = require("commander");
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);

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
var program = new import_commander.Command();
program.name("compatguard").version("1.0.0");
program.command("lint <paths...>").option("-b, --baseline <year>", "Target baseline", "2024").option("--fix", "Attempt auto-fix", false).description("Lint files for Baseline compatibility").action(async (paths, opts) => {
  console.log("\u{1F50D} CompatGuard CLI - lint", paths, opts);
  const linter = new CompatGuardLinter(opts.baseline);
  await linter.initialize();
  for (const p of paths) {
    try {
      const content = await import_promises.default.readFile(p, "utf-8");
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
  await import_promises.default.writeFile(import_path.default.resolve(".compatguardrc.json"), JSON.stringify(cfg, null, 2));
  console.log("Wrote .compatguardrc.json");
});
program.parse(process.argv);
//# sourceMappingURL=index.cjs.map