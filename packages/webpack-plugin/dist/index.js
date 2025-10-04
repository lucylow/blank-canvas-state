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

// packages/webpack-plugin/src/index.ts
var CompatGuardWebpackPlugin = class {
  constructor(opts = {}) {
    this.opts = opts;
    this.linter = new CompatGuardLinter(opts.targetBaseline || "2024");
  }
  apply(compiler) {
    compiler.hooks.done.tap("CompatGuardWebpackPlugin", async () => {
      await this.linter.initialize();
      console.log("CompatGuardWebpackPlugin ran (stub).");
    });
  }
};
var index_default = CompatGuardWebpackPlugin;
export {
  CompatGuardWebpackPlugin,
  index_default as default
};
//# sourceMappingURL=index.js.map