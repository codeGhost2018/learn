# learn

[![video](assets/thumbnail.png)](https://www.youtube.com/watch?v=kzcI5F4tGiU)

My AI learning system from this video: [How I Use AI to Learn Things](https://www.youtube.com/watch?v=kzcI5F4tGiU).

This is a personal system I built for myself, shared as-is. Built as a pi configuration: the teaching philosophy encoded in a skill, a few small extensions, and agent definitions.

## What's in it

- `skills/teach/` — the philosophy and the process
- `skills/visualize/` — adds a correct, minimal diagram to a lesson when an idea is clearer as a picture
- `extensions/ask-user-question/` — the agent asks you questions through a UI popup
- `extensions/quiz/` — graded questions with instant feedback (✓/✗, correct answer, explanation)
- `extensions/md-log/` — link a markdown file to the session
- `extensions/visual-tools/` — legacy PNG tools for visualization subagents; the source-only `mermaid-maker` does not use them
- `agents/` — `researcher`, `svg-maker`, `mermaid-maker`: the subagents the system delegates to

## Install

This repo **is** a `.pi` directory. From your learning project's root:

```bash
git clone https://github.com/amosblomqvist/learn .pi
```

Then open pi in that directory. (Or copy the pieces you want into your existing project config.)

## Requirements

- [pi](https://github.com/earendil-works/pi)
- A subagent implementation, so the system can spawn the researcher and the visual makers. The `mermaid-maker` is configured for [pi-subagents](https://www.npmjs.com/package/pi-subagents), which discovers it from `agents/` and returns Mermaid source directly. Other agents may need adaptation: `agents/researcher.md` still lists tools from pi-interactive-subagents, and `svg-maker` still requires its PNG tools and renderer.
- A Mermaid-enabled Markdown viewer, such as Obsidian, for inline diagrams. The Mermaid path requires no renderer installation or PNG generation.
- `ask-user-question` — use the copy bundled here. If your setup already has an `ask-user-question` extension, use **this** one in its place. Popups from different extensions serialize through a shared UI lock, which only works when it's the same implementation.

## Notes

You can run the system without subagents. The main session does the teaching. You just lose the researcher (truth verification) and the generated visuals.

The teaching skill is written for one learner (me). Edit the skill to fit how you learn best.

## 本 Fork 的修改说明

以下修改由 **tim.zl** 完成：

- 将 `mermaid-maker` 适配为 `pi-subagents` 支持的标准代理配置，由插件自动发现 `.pi/agents/` 中的代理，无需使用旧版 `pi-interactive-subagents` 的工具注册接口。
- 将 Mermaid 输出改为单个 `mermaid` 代码块，可直接嵌入 Markdown，由 Obsidian 或其他支持 Mermaid 的阅读器渲染。此流程无需额外安装渲染器、命令行工具或依赖，也无需生成 PNG。
- 同步更新 `visualize` skill，使其将 Mermaid 源码直接嵌入课程 Markdown。代理负责检查源码和图中关系，Markdown 阅读器负责渲染与布局。

已通过实际调用 `pi-subagents` 验证 Mermaid 源码输出。SVG 代理保留原有的 PNG 生成流程，仍需相应的绘图工具和渲染器。
