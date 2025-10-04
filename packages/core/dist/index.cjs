"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/core/src/index.ts
var index_exports = {};
__export(index_exports, {
  CompatGuardLinter: () => CompatGuardLinter,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
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
var index_default = CompatGuardLinter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompatGuardLinter
});
//# sourceMappingURL=index.cjs.map