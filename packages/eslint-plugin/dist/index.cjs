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

// packages/eslint-plugin/src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  rules: () => rules
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  rules
});
//# sourceMappingURL=index.cjs.map