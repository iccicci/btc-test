const rules = {
  "arrow-body-style":                           ["error", "as-needed"],
  "arrow-parens":                               ["error", "as-needed"],
  "arrow-spacing":                              "error",
  "brace-style":                                ["error", "1tbs", { allowSingleLine: true }],
  curly:                                        ["error", "multi-or-nest"],
  indent:                                       ["error", 2],
  "key-spacing":                                ["error", { align: { afterColon: true, beforeColon: false, on: "value" } }],
  "keyword-spacing":                            ["error", { before: true, overrides: { catch: { after: false }, if: { after: false }, for: { after: false }, switch: { after: false }, while: { after: false } } }],
  "linebreak-style":                            ["warn", "unix"],
  "no-console":                                 "warn",
  "no-mixed-spaces-and-tabs":                   ["error", "smart-tabs"],
  "nonblock-statement-body-position":           ["error", "beside"],
  "react-hooks/exhaustive-deps":                "off",
  semi:                                         ["error", "always"],
  "space-before-function-paren":                ["error", { anonymous: "never", asyncArrow: "always", named: "never" }],
  "space-unary-ops":                            ["error", { nonwords: false, words: true, overrides: { "!": true } }],
  "@typescript-eslint/no-empty-function":       "off",
  "@typescript-eslint/no-empty-interface":      "off",
  "@typescript-eslint/no-explicit-any":         "error",
  "@typescript-eslint/type-annotation-spacing": ["error", { after: true, before: false, overrides: { arrow: { before: true } } }]
};

module.exports = {
  extends:        ["react-app"],
  ignorePatterns: ["**/node_modules", "cicd/web/build/**", "**/*.d.ts"],
  rules
};
