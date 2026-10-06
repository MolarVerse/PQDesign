# PQDesign

PQDesign provides the visual primitives for scientific interfaces: colour,
type, spacing, field labels, controls and dialogs. The application owns
layout, data, units, validation and analysis.

![Package flow: tokens generate CSS; CSS and React controls are separate inputs to applications. Documentation can use the token stylesheet directly.](_static/design-flow.svg)

Choose the export to match the consumer:

| Consumer | Import | Effect |
| --- | --- | --- |
| React app using shared controls | `@molarverse/pq-design/styles.css` | Tokens, page defaults and component styles |
| App with its own controls, or documentation | `@molarverse/pq-design/tokens.css` | CSS variables and light colour scheme |
| Renderer that reads design values as data | `@molarverse/pq-design/tokens.json` | Font, colour, shape, spacing and code-colour values |

Read [Getting started](getting-started.md) to install and render a control.
The [Reference](reference.md) lists exports, token names and the release
procedure.

```{toctree}
:hidden:

getting-started
reference
```

## Design conventions

Keep labels short and put units next to the quantity. Use a visible label
for every input. Add supplementary explanations through `Info` or a field's
`info` property. Keep keyboard focus visible and communicate status with
text as well as colour.

The supplied theme uses square corners, neutral surfaces and blue focus
indicators. IBM Plex Mono is first in the font stack; the consumer supplies
font files when that exact face is required. Grid layout and breakpoints
belong to the application.
