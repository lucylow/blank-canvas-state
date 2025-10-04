// packages/eslint-plugin/src/index.ts
var rules = {
  "baseline": {
    meta: { type: "problem", docs: { description: "Disallow features not in baseline" } },
    create(context) {
      return {
        CallExpression(node) {
          try {
            const name = context.getSourceCode().getText(node.callee);
            if (name.includes("IntersectionObserver")) {
              context.report({ node, message: "IntersectionObserver may not meet the baseline target" });
            }
          } catch (e) {
          }
        }
      };
    }
  }
};
var index_default = { rules, configs: { recommended: { plugins: ["compatguard"], rules: { "compatguard/baseline": "warn" } } } };
export {
  index_default as default,
  rules
};
//# sourceMappingURL=index.js.map