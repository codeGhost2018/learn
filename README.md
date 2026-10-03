# learn

[![video](assets/thumbnail.png)](https://www.youtube.com/watch?v=kzcI5F4tGiU)

这是一个基于视频搭建的个人 AI 学习系统：[How I Use AI to Learn Things](https://www.youtube.com/watch?v=kzcI5F4tGiU)。

它以 Pi 配置的形式组织，包括教学方法、若干扩展和用于研究与视觉解释的 Agent。

## 项目内容

- `skills/teach/`：教学理念与教学流程
- `skills/visualize/`：根据教学目标选择 Mermaid、SVG 或图片生成路线
- `extensions/ask-user-question/`：通过 UI 弹窗向用户提问
- `extensions/quiz/`：提供带即时反馈的测验
- `extensions/md-log/`：将会话同步到指定 Markdown 文件
- `extensions/visual-tools/`：旧版 Mermaid/SVG PNG 工具，主要用于兼容旧的 Agent 配置
- `agents/researcher.md`：网络研究 Agent
- `agents/mermaid-maker.md`：生成关系结构 Mermaid 源码的 Agent
- `agents/svg-maker.md`：生成精确几何 SVG/PNG 的 Agent
- `agents/image-maker.md`：生成复杂空间教学场景的图片 Agent
- [`change.md`](change.md)：按日期记录每次修改

## 安装

本仓库本身就是一个 `.pi` 目录。从学习项目根目录执行：

```bash
git clone https://github.com/amosblomqvist/learn .pi
```

然后在该项目目录中启动 Pi。也可以将需要的部分复制到已有的项目配置中。

## 依赖

- [Pi](https://github.com/earendil-works/pi)
- 能够从 `agents/` 发现并运行 Agent 的 subagent 实现
- 支持 Mermaid 的 Markdown 阅读器，例如 Obsidian
- `svg-maker` 所需的 SVG 工具和本地渲染器
- `image-maker` 所需的 `pixeltamer` skill

`image-maker` 是条件能力。它必须先确认当前 Pi 环境中存在且能够读取 `pixeltamer` skill，并满足以下任一配置条件：`pixeltamer doctor` 报告可用 backend，或者 Pixeltamer 配置文件存在且包含受支持的配置项，例如 `OPENAI_IMAGE_API_KEY`、`OPENAI_API_KEY`、`OPENAI_IMAGE_BASE_URL` 或 `PIXELTAMER_BACKEND`。后者用于兼容第三方模型源，因为 `doctor` 可能看不到 Pixeltamer 自己从 `.env` 加载的配置。最终仍由真实生成命令的 `--json` 结果判断调用是否成功。不要读取、打印或提交配置中的密钥值。

Pixeltamer 常见配置位置是：

```text
$HOME/.config/pixeltamer/.env
```

不要提交或泄露该文件的内容。

## 注意事项

没有 subagent 时，主会话仍然可以完成教学流程，但会失去研究和视觉生成能力。如果没有 `pixeltamer` skill 或可用的图片 backend，不能调用 `image-maker`，应改用 Mermaid、SVG 或文字解释。

教学 skill 默认面向一个学习者。如果学习目标或交互方式不同，可以根据需要调整。

## FORK INFO

本项目基于原始 `learn` 项目 Fork。上游项目的基础结构和教学理念保留在本仓库中；本节之后记录本 Fork 的实际修改。

### 当前 Fork 修改总结

- 将 `mermaid-maker` 保持为 Mermaid 源码 Agent：用于依赖图、流程、状态机、树和其他小型关系结构，不负责生成 PNG。
- 将 `svg-maker` 保持为精确图形 Agent：用于坐标、比例、角度、公式、数值和其他确定性几何内容。
- 新增 `image-maker`：用于大型系统、复杂空间场景、三维结构、视觉隐喻和图片模型更适合表达的教学插图。
- 将 `visualize` skill 升级为三路视觉路由：关系结构使用 Mermaid，精确几何使用 SVG，复杂空间场景使用图片生成模型。
- 保留教学计划中的依赖 DAG 使用 Mermaid，因为它表达的是知识之间的依赖关系，不能由图片模型替代。
- `image-maker` 只有在当前环境中检测到 `pixeltamer` skill，并且满足以下任一条件时才可使用：`pixeltamer doctor` 报告可用 backend，或 Pixeltamer 配置文件存在且含受支持配置项。最终通过真实生成命令的 `--json` 结果判断 backend，而不是只依赖 `pixeltamer doctor`。
- 图片生成结果必须被读取和人工检查后才能发布到 `viz/`。
- 暂不增加独立的 `hybrid-visual-maker`；只有在真实课程反复需要“图片主体加精确标注”时，才考虑增加 annotated mode。
- 新增 [`change.md`](change.md)，记录每次修改的日期、内容、测试结果和已知限制。

后续修改 README 时，保持以下顺序和规则：

1. 先维护项目原始说明和当前通用使用说明。
2. 保留 `FORK INFO` 作为 Fork 修改的边界。
3. 将本 Fork 的新增或变更总结写在 `FORK INFO` 后面。
4. 将详细的日期、测试和限制记录在 [`change.md`](change.md) 中。
5. README 和 `change.md` 均使用中文说明新增的 Fork 修改。
