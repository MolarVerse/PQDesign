# Getting started

## Requirements

| Dependency | Package requirement | Purpose |
| --- | --- | --- |
| Node.js | `>=20` | Install and build the package |
| React | `>=19.0.0` | Render controls |
| React DOM | `>=19.0.0` | Mount controls and tooltip portals |
| Lucide React | `>=0.400.0` | Control icons |

## Install

In a React project with a CSS-capable bundler:

```bash
npm install react@19 react-dom@19 lucide-react@0.468 \
  "https://github.com/MolarVerse/PQDesign/releases/download/v0.1.2/molarverse-pq-design-0.1.2.tgz"
```

Commit `package.json` and `package-lock.json`. Later installations use
`npm ci`; the archive is independent of adjacent repository checkouts.

## Render a control

Place this in the client entry point, with `<div id="root"></div>` in the
HTML page. State remains in the application.

```tsx
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Field, Group } from "@molarverse/pq-design";
import "@molarverse/pq-design/styles.css";

function TemperatureControl() {
  const [temperature, setTemperature] = useState("300");

  return (
    <Group title="Temperature">
      <Field label="Target" unit="K">
        <input
          type="number"
          min="0"
          value={temperature}
          onChange={(event) => setTemperature(event.target.value)}
        />
      </Field>
      <output>{temperature} K</output>
    </Group>
  );
}

createRoot(document.getElementById("root")!).render(<TemperatureControl />);
```

`Field` assigns an input ID and associates it with the label. The example
stores the input text; scientific validation and conversion to a numeric
value belong to the application. Import app-specific CSS after the package
stylesheet. Controls with dialogs or tooltips use the browser DOM.

## Use only the tokens

For existing controls, import the token stylesheet and map variables to
your own selectors:

```css
@import "@molarverse/pq-design/tokens.css";

.result-panel {
  padding: var(--pad);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--border);
  font-family: var(--mono);
}
```

`styles.css` includes global selectors such as `body`, `.notice` and
`.command-palette`. Use `tokens.css` when those names already belong to the
consumer.

## Documentation styling

Use the exported `tokens.css` and the shared documentation stylesheet,
`docs/_static/pq-docs.css`, for the manuals of all PQ tools. The adapter maps
PQDesign values to the Furo theme:

```css
body {
  --font-stack: var(--mono);
  --font-stack--monospace: var(--mono);
}

body[data-theme="light"] {
  --color-foreground-primary: var(--ink);
  --color-background-primary: var(--surface);
  --color-brand-primary: var(--accent);
}
```

Copy the token stylesheet from the installed version and the shared
documentation stylesheet into the site's static assets. Record the token
archive URL and checksum, and load tokens before `pq-docs.css`. Local copies
keep documentation builds independent of other repository checkouts.
The complete stylesheet also handles automatic light mode while retaining
Furo's dark palette. Furo supplies navigation, search and page structure; font files and layout
remain with the documentation site.
