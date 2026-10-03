# Change Log

This file records dated changes to the Pi learning configuration. Add one entry for every implementation or behavior change.

## 2026-10-03

### Visual agent routing

- Added `agents/image-maker.md` for complex teaching illustrations: large spatial scenes, layered systems, visual metaphors, cutaways, and multi-object environments.
- Kept `mermaid-maker` for small relationship structures and `svg-maker` for deterministic geometry, coordinates, formulas, and values.
- Updated `skills/visualize/SKILL.md` with three-way routing rules, structured briefs, output embedding rules, and verification boundaries.
- Kept the teaching dependency DAG on Mermaid. Generated scenes are supporting visual explanations, not replacements for exact knowledge relationships.
- Did not add a separate `hybrid-visual-maker`; an annotated image mode can be added later if real lessons repeatedly need it.

### Pixeltamer integration

- Made `image-maker` conditional on the `pixeltamer` skill being present and readable.
- Changed backend validation to use the actual Pixeltamer generation command with `--json` rather than treating `pixeltamer doctor` as a hard gate.
- Confirmed that the configured third-party API works when the Pixeltamer `.env` is loaded:
  `/Users/tim.zl/.config/pixeltamer/.env`.
- Confirmed that the configuration uses `OPENAI_IMAGE_API_KEY`, `OPENAI_IMAGE_BASE_URL`, `OPENAI_IMAGE_MODEL`, and `PIXELTAMER_BACKEND`.
- Generated and visually inspected a complex web-request lifecycle teaching scene at:
  `viz/viz-web-request-lifecycle-1791021903.png`.
- The generated image used a 1536x1024 PNG canvas and showed a browser, DNS, network/CDN layer, gateway, application servers, cache, database, request path, and response path.
- Did not record or expose any credential values.

### Documentation

- Rewrote `README.md` to describe the current system rather than the old Fork-specific migration notes.
- Added the current visual routing, Pixeltamer prerequisite, `.env` convention, failure behavior, and this change-log link.

### Known limitations

- The Pixeltamer Bash dispatcher can choose a backend before loading its `.env`; callers that rely on the dispatcher must ensure the skill's configuration is loaded in the process environment, or use the skill's supported wrapper/integration that handles this.
- The generated image path above is a local test artifact and should only be committed if the project wants to keep the example asset.
