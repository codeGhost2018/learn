---
name: visualize
description: "Choose and embed one useful visual for a lesson. Route simple relationships to Mermaid, precise geometry to SVG, and complex spatial or visually narrative scenes to an image-generation agent."
---

# Visualize

A visual earns its place when it makes something easier to understand than words alone: a relationship, a precise shape, a spatial model, or a visual metaphor. Produce ONE visual with ONE teaching goal. Do not add decoration that merely repeats the prose.

The teaching plan's dependency map remains Mermaid because it expresses the logic of what depends on what. This skill adds optional visual support for a particular concept; an image-maker visual does not replace the teaching DAG.

## Choose the medium

Route by the kind of truth the learner must read from the result:

### `mermaid-maker`: relationships

Use for small, explicit structures where the connections are the content:

- dependency graphs and teaching DAGs;
- short flows and pipelines;
- state machines and sequences;
- trees, hierarchies, ER diagrams, and simple timelines.

Use Mermaid when the reader must accurately follow nodes and edges. Keep the graph small, usually 5–7 nodes. It returns Mermaid source for direct Markdown embedding and does not generate a PNG.

### `svg-maker`: precise positions

Use for figures where coordinates, proportions, angles, formulas, values, or exact geometry are the content:

- coordinate geometry and number lines;
- vectors and function plots;
- simple physical layouts;
- memory maps or other precise spatial diagrams.

It hand-authors SVG, renders a preview, looks at it, iterates, and publishes a verified PNG. It requires its existing SVG tools and a local renderer.

### `image-maker`: complex scenes

Use when the learner needs an overall spatial or visual model and a small code diagram would become crowded or mechanically flat:

- large systems with many objects and layers;
- multi-stage real-world or technical scenes;
- cutaways, 3D structures, and visual metaphors;
- browser/network/cloud/computer overviews;
- concepts such as caching, recursion, concurrency, virtual memory, or garbage collection when spatial intuition is the goal.

Use it when at least two of these are true: many objects, multiple spatial layers, a large scene, a need for material/environment/scale, or a visual narrative that cannot be expressed naturally by nodes and edges. The image model may express the scene freely, but the brief must identify the required objects and relations.

Do not use it for exact formulas, dense labels, data tables, byte layouts, or diagrams where every arrow and number must be authoritative. Those belong to Mermaid or SVG.

## Routing rules

```text
Is the main information who connects to whom?
  yes -> mermaid-maker

Is the main information exact position, scale, angle, value, or formula?
  yes -> svg-maker

Is the main information a large spatial scene, layered system, or visual metaphor?
  yes -> image-maker

Otherwise:
  do not force a visual; use prose or split the concept into smaller visuals.
```

If a concept has both a complex scene and a few exact annotations, start with `image-maker` only when the scene itself is the teaching goal. Keep annotations short. Do not introduce a separate hybrid agent in this version; add a later annotated mode only if real lessons repeatedly require programmatic labels over generated scenes.

### `image-maker` preflight

The image route is conditional. Before dispatching it, verify that the `pixeltamer` skill is actually available in the current Pi environment and readable. A file such as `.pi/agents/image-maker.md` does not provide image generation by itself.

The skill owns backend selection, `.env` loading, third-party `OPENAI_IMAGE_BASE_URL` support, and authentication. Do not use `pixeltamer doctor` as a hard gate: it may inspect only exported environment variables and miss credentials loaded from the skill's documented `.env` files. After confirming the skill exists, run the real generation command with `--json`; its structured `ok` result is the actual backend/request check. If that call fails, report the error and route to Mermaid, SVG, or prose.

Typical skill locations are environment-specific, for example:

```text
$PI_AGENT_HOME/skills/pixeltamer/SKILL.md
$HOME/.pi/agent/skills/pixeltamer/SKILL.md
$HOME/.claude/skills/pixeltamer/SKILL.md
```

Use the path provided by the current environment. Do not assume that a skill available in one Pi installation is available in another.

## Briefing any maker

Before dispatching, write a compact brief with:

- one teaching goal;
- what the learner should notice;
- required objects or elements;
- required relations or spatial order;
- what must not be invented;
- language and output format.

For Mermaid/SVG, specify exact relations, values, and geometry. For image-maker, specify the scene, viewpoint, spatial relations, style, aspect ratio, and whether text should be absent or minimal. Do not ask an image model to render dense code, formulas, tables, or exact numeric diagrams.

## Dispatch

`pi-subagents` discovers agents from `.pi/agents/`. Confirm the selected agent is executable with `subagent({ action: "list", capabilities: true })`. For `image-maker`, complete the `pixeltamer` skill existence check above first; capability discovery alone is not proof that image generation is available. The real generation call with `--json` is the backend check.

Then dispatch the appropriate maker:

```json
{
  "agent": "<mermaid-maker|svg-maker|image-maker>",
  "task": "<the concrete brief and the maker's output contract>",
  "async": true
}
```

Do not launch a duplicate maker while a background run is active. On infrastructure failure, report the failure explicitly; do not fabricate a diagram, image, or path.

## Embed the result

For Mermaid, copy the single returned fenced `mermaid` block directly into the lesson. Do not add an outer fence or claim that the maker rendered it.

For SVG and image PNGs, use the returned filename with an Obsidian embed:

```text
![[viz-<slug>-<timestamp>.png|700]]
```

The PNG must exist in the vault's `viz/` directory. Use a smaller width for a compact figure and a larger width for a wide system scene.

## Verification boundary

- Mermaid: the maker reviews source syntax and relationships; the Markdown viewer owns rendering and layout.
- SVG: the maker must render and inspect the PNG before publishing.
- Image: the maker must inspect the generated PNG against the brief before publishing. A successful model/API call is not visual verification.
