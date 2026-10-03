# learn

[![video](assets/thumbnail.png)](https://www.youtube.com/watch?v=kzcI5F4tGiU)

My AI learning system from this video: [How I Use AI to Learn Things](https://www.youtube.com/watch?v=kzcI5F4tGiU).

This is a personal system I built for myself, shared as-is. Built as a pi configuration: the teaching philosophy encoded in a skill, a few small extensions, and agent definitions.

## What's in it

- `skills/teach/` — the philosophy and the process
- `skills/visualize/` — routes visual work to Mermaid, SVG, or image generation based on the teaching need
- `extensions/ask-user-question/` — the agent asks you questions through a UI popup
- `extensions/quiz/` — graded questions with instant feedback (✓/✗, correct answer, explanation)
- `extensions/md-log/` — link a markdown file to the session
- `extensions/visual-tools/` — legacy PNG tools for visualization subagents; the source-only `mermaid-maker` does not use them
- `agents/` — `researcher`, `svg-maker`, `mermaid-maker`, and the optional `image-maker` visual agents

## Install

This repo **is** a `.pi` directory. From your learning project's root:

```bash
git clone https://github.com/amosblomqvist/learn .pi
```

Then open pi in that directory. (Or copy the pieces you want into your existing project config.)

## Requirements

- [pi](https://github.com/earendil-works/pi)
- A subagent implementation, so the system can spawn the researcher and visual makers. The `mermaid-maker` is discovered from `agents/` and returns Mermaid source directly. `svg-maker` requires its PNG tools and renderer. `image-maker` is conditional: it may be dispatched only when the `pixeltamer` skill is installed and readable in the current Pi environment; the actual generation command with `--json` is used to verify the configured backend.
- A Mermaid-enabled Markdown viewer, such as Obsidian, for inline diagrams. The Mermaid path requires no renderer installation or PNG generation.
- `pixeltamer` skill for model-generated teaching scenes. Typical locations are `$PI_AGENT_HOME/skills/pixeltamer/SKILL.md`, `$HOME/.pi/agent/skills/pixeltamer/SKILL.md`, or an equivalent environment-specific skill path. The skill owns `.env` loading and third-party base URL configuration. Do not use `pixeltamer doctor` as a hard gate; run the actual generation command with `--json` and use its structured result to detect backend availability. If generation fails, route to Mermaid, SVG, or prose instead.
- `ask-user-question` — use the copy bundled here. If your setup already has an `ask-user-question` extension, use **this** one in its place. Popups from different extensions serialize through a shared UI lock, which only works when it's the same implementation.

## Notes

You can run the system without subagents. The main session does the teaching. You just lose the researcher (truth verification) and the generated visuals.

The teaching skill is written for one learner (me). Edit the skill to fit how you learn best.

## 本 Fork 的修改说明

以下修改由 **tim.zl** 完成：

- 将 `visualize` 扩展为三路视觉路由：`mermaid-maker` 负责关系结构，`svg-maker` 负责精确几何，`image-maker` 负责复杂空间场景和视觉隐喻。
- 新增 `image-maker`，但它是条件能力：只有检测到当前 Pi 环境中的 `pixeltamer` skill 且实际生成命令返回 `--json` 成功结果时才允许发布图片。skill 自己负责加载 `.env`、第三方 base URL 和 backend 配置。
- 图片生成结果必须查看并验证后才能发布到 `viz/`；图片模型不可替代教学依赖 DAG、精确公式、数据表格或坐标图。
- 暂不引入独立的 `hybrid-visual-maker`，后续只有在真实课程反复需要精确标注叠加时再增加 annotated mode。
