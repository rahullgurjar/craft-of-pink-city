---
description: Always directly implement and verify changes on the website codebase
globs: ["**/*"]
---

# Always Implement Changes Directly On Website

Whenever any request, feature, tweak, or bug fix is made:
1. **Directly Update Website Code**: Apply all modifications directly to the active project files (`src/`, `components/`, `utils/`, `data/`, etc.).
2. **Build Verification**: Run `npm run build` or the dev server to ensure all changes compile and work without runtime issues.
3. **No Unapplied Proposals**: Never stop at conceptual proposals; always execute and apply them directly to the website code.
