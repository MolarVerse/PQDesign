# @molarverse/pq-design

Shared flat mono tokens, CSS and React controls for PQSetup, PQViewer and
PQEnalyzer Web. The package uses the IBM Carbon Gray 10 palette, IBM Plex Mono,
square corners and hairline dividers.

## Install

Install a versioned archive from this repository's public GitHub release:

```bash
npm install "https://github.com/MolarVerse/PQDesign/releases/download/v0.1.2/molarverse-pq-design-0.1.2.tgz"
```

Commit the updated `package.json` and `package-lock.json`. A clean `npm ci`
works without a sibling PQSetup checkout. The app must provide React 19,
React DOM 19 and Lucide as peer dependencies.

```tsx
import "@molarverse/pq-design/styles.css";
import { ConditionRow, Field, Info, Modal, Toggle } from "@molarverse/pq-design";
```

Import the shared stylesheet before app-specific layout rules when using the
shared React controls. Its component selectors are global (including
`.command-palette` and `.notice`), so an app with its own components should
import only `@molarverse/pq-design/tokens.css` and keep its own component CSS.
`tokens.json` is available for non-CSS consumers. The CSS font stack prefers
IBM Plex Mono; apps requiring that exact face must supply its font files.

## Package contents

- `tokens.json` is the source for shared colour, type, spacing and shape values.
- `src/styles/tokens.css` is generated from the JSON. `base.css` and
  `components.css` style shared controls and public class names.
- `dist/index.js` and TypeScript declarations provide `Modal`, `Info`,
  `Field`, `Choice`, `Toggle`, `Group`, `ConditionRow` and `CommandPalette`.
- `CommandPalette` takes tool-specific commands and a display order; it has no
  PQSetup-specific navigation.

The design rules are: monospaced type, square controls, one-pixel dividers,
clear two-pixel keyboard focus, and no shadows. Keep page layout and product
logic in the consuming app.

## Change and release

Edit this repository. When tokens change, run `npm run tokens` and commit
the generated CSS. Validate with `npm ci`, `npm test`, `npm run build`,
`npm pack`, and `node scripts/verify-package.mjs <archive>`.

Bump this package's version when exported controls, tokens or public class
names change. A `v<version>` tag on a verified main commit publishes
the installable archive and SHA-256 checksums. Consumers update the archive
URL and lockfile together. The design version is independent of PQSetup's
Python release version.
