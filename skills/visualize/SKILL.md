---
name: visualize
description: "Choose and embed one useful visual for a lesson. Route simple relationships to Mermaid, precise geometry to SVG, and complex spatial or visually narrative scenes to an image-generation agent."
---

# Visualize

A visual earns its place when it makes something easier to understand than words alone: a relationship, a precise shape, a spatial model, or a visual metaphor. Every lesson must make an explicit visual choice and should normally begin with one useful visual anchor. Produce ONE visual with ONE teaching goal; do not add decoration that merely repeats the prose.

The teaching plan's dependency map remains Mermaid because it expresses the logic of what depends on what. It is required, but it does not count as the lesson's visual anchor. The anchor comes first and gives the learner an intuitive whole; the dependency map and any later Mermaid/SVG figures make the explanation's structure and precision explicit.

## Visual anchor first

During lesson planning, always ask: "What should the learner be able to see before reading the explanation?" Prefer `image-maker` for the anchor when a generated scene, system overview, physical analogy, layered environment, or visual narrative can make the concept easier to understand. This is a default evaluation, not a command to generate an image for every topic.

Use exactly one anchor route and record the reason:

- `image-maker`: default for the conceptual overview when the learner benefits from seeing the whole system, scene, scale, layers, objects, or transformation. It may be simple; it does not need to satisfy the old "large complex scene" threshold.
- `mermaid-maker`: use for the anchor when the concept itself is primarily a small, exact set of relationships and an illustrative scene would obscure the meaning.
- `svg-maker`: use when the learner must see exact positions, proportions, angles, values, or formulas.
- no generated visual: allowed only when a visual would not add understanding or would be misleading; explain the reason and use a concrete prose example instead.

The anchor must appear before the detailed teaching nodes. Add one or two sentences telling the learner what to notice. Do not let the required Mermaid teaching DAG silently replace this decision.

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

### `image-maker`: conceptual scenes and system models

Use it as the default anchor candidate when the learner needs an overall mental model, even when the scene is not especially large or complex:

- large systems with many objects and layers;
- multi-stage real-world or technical scenes;
- cutaways, 3D structures, and visual metaphors;
- browser/network/cloud/computer overviews;
- concepts such as caching, recursion, concurrency, virtual memory, or garbage collection when spatial intuition is the goal.

Use it when the learner benefits from seeing the whole system, scene, transformation, layers, scale, environment, or visual metaphor. A small code diagram may still be clearer for exact relationships, but do not reject an image merely because Mermaid can technically represent the topic. The brief must identify the required objects and relations, and the image must remain a faithful intuition rather than an authoritative source for exact topology or numbers.

Do not use it for exact formulas, dense labels, data tables, byte layouts, or diagrams where every arrow and number must be authoritative. Those belong to Mermaid or SVG.


## Routing rules

```text
First ask: would a conceptual scene or visual model make the lesson easier to understand?
  yes -> image-maker is the default anchor candidate

If the concept must be read as exact relationships rather than as a scene:
  yes -> mermaid-maker

If the concept must be read as exact position, scale, angle, value, or formula:
  yes -> svg-maker

If a generated visual would add no understanding or would mislead:
  explain why -> use prose or a precise alternative
```

The anchor decision comes before the detailed representation decision. An image can introduce the intuition, while a later Mermaid or SVG figure supplies exact structure. Do not generate multiple visuals for one anchor goal.

If a concept has both a conceptual scene and a few exact annotations, use `image-maker` for the anchor when the scene itself is the teaching goal. Keep annotations short and put authoritative values or relationships in the accompanying Mermaid/SVG or prose. Do not introduce a separate hybrid agent in this version; add a later annotated mode only if real lessons repeatedly require programmatic labels over generated scenes.

### `image-maker` preflight

The image route is available when the `pixeltamer` skill is readable and a Pixeltamer configuration file is readable. Do **not** run `pixeltamer doctor` as a prerequisite: third-party API settings may be loaded from Pixeltamer's `.env` and are not necessarily visible to doctor.

Check only the configuration file's readability and whether it contains at least one supported setting name, such as `OPENAI_IMAGE_API_KEY`, `OPENAI_API_KEY`, `OPENAI_IMAGE_BASE_URL`, or `PIXELTAMER_BACKEND`. Never print or expose values. The actual generation command with `--json` is the only backend success check; report its failure without fabricating an image or path.

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

`pi-subagents` discovers agents from `.pi/agents/`. Confirm the selected Agent is executable with `subagent({ action: "list", capabilities: true })`. For `image-maker`, complete the `pixeltamer` Skill and configuration-file preflight above first; capability discovery alone is not proof that image generation is available. The Agent must invoke the Pixeltamer API backend helper directly with `--json`, not `pixeltamer doctor` or the Bash dispatcher, so the helper can load third-party `.env` settings. The real generation result is the final backend check.

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
