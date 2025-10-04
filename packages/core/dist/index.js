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
var index_default = CompatGuardLinter;
export {
  CompatGuardLinter,
  index_default as default
};
//# sourceMappingURL=index.js.map