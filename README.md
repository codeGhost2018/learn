# learn

[![video](assets/thumbnail.png)](https://www.youtube.com/watch?v=kzcI5F4tGiU)

A personal AI learning system built as a Pi configuration. It combines a teaching philosophy, a few small extensions, and specialized agents for research and visual explanations.

## What's in it

- `skills/teach/` — the teaching philosophy and learning process
- `skills/visualize/` — chooses the right visual medium for a lesson
- `extensions/ask-user-question/` — asks open-ended questions through a UI popup
- `extensions/quiz/` — presents graded questions with instant feedback
- `extensions/md-log/` — mirrors a session into a linked Markdown file
- `extensions/visual-tools/` — legacy Mermaid/SVG PNG tools for older subagent setups
- `agents/researcher.md` — web research agent
- `agents/mermaid-maker.md` — Mermaid source agent for small relationship diagrams
- `agents/svg-maker.md` — precise SVG and PNG agent for geometry and spatial diagrams
- `agents/image-maker.md` — conditional image-generation agent for complex spatial scenes
- [`change.md`](change.md) — dated change log

## Visual routing

The `visualize` skill uses three complementary routes:

- `mermaid-maker` for dependency graphs, short flows, state machines, trees, and other small relationship structures. It returns Mermaid source for direct Markdown or Obsidian rendering.
- `svg-maker` for exact coordinates, proportions, angles, formulas, values, and other deterministic geometry. It renders and verifies a PNG in `viz/`.
- `image-maker` for large systems, layered scenes, visual metaphors, cutaways, and spatial explanations that would become crowded or mechanically flat as code diagrams.

The teaching dependency map remains Mermaid because its arrows express the logic of what depends on what. An image-generated scene is supporting intuition, not a replacement for the knowledge DAG or for exact formulas and data.

## Install

This repo **is** a `.pi` directory. From your learning project's root:

```bash
git clone https://github.com/amosblomqvist/learn .pi
```

Then open Pi in that directory. You can also copy the pieces you need into an existing project configuration.

## Requirements

- [Pi](https://github.com/earendil-works/pi)
- A subagent implementation that discovers agents from `agents/`
- A Mermaid-enabled Markdown viewer, such as Obsidian, for inline Mermaid diagrams
- The existing SVG tools and a local renderer for `svg-maker`
- The `pixeltamer` skill for `image-maker`, installed and readable in the current Pi environment

`image-maker` is conditional. The agent first checks that the `pixeltamer` skill exists, then invokes the skill's documented generation command with `--json`. The generation result, not `pixeltamer doctor`, determines whether the configured backend is usable. This matters because Pixeltamer can load credentials and third-party API settings from its own `.env` files, which may not be visible to a separate diagnostic check.

The skill's common configuration location is:

```text
$HOME/.config/pixeltamer/.env
```

Do not commit that file or expose its contents.

## Notes

The system can run without subagents; the main session can still teach directly. Without the visual agents, it loses the generated visual workflows. Without the `pixeltamer` skill or a working image backend, `image-maker` must not be used; route the visual to Mermaid, SVG, or prose instead.

The teaching skill is written for one learner. Adapt it if your learning goals or interaction style differ.

## Change Log

See [`change.md`](change.md) for dated implementation changes, test results, and known limitations.
