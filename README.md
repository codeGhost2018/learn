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
- `extensions/visual-tools/`：SVG 子 Agent 的写入、编辑与 PNG 渲染工具；另保留可显式加载的旧版 Mermaid PNG 工具
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

### 安装 SVG 渲染器（使用 `svg-maker` 时）

`svg-maker` 需要本地程序将 SVG 源码渲染成 PNG，供模型查看和检查。推荐使用 `rsvg-convert`，它由 **librsvg** 提供，不是 Pi 自带的工具，也不会随克隆本仓库自动安装；每台使用 SVG 功能的电脑都需要单独准备。

macOS 安装（需先安装 [Homebrew](https://brew.sh/)）：

```bash
brew install librsvg
```

安装后检查：

```bash
command -v rsvg-convert
rsvg-convert --version
```

两个命令应分别输出可执行文件路径和版本信息。若提示 `command not found`，检查 Homebrew 的 `bin` 目录是否在 `PATH` 中。

当前工具优先使用 `rsvg-convert`，失败时才尝试 ImageMagick 的 `magick`；**安装 librsvg 即可，不需要同时安装 ImageMagick**。仅使用 Mermaid 源码 Agent 时不需要此渲染器。

## 依赖

- [Pi](https://github.com/earendil-works/pi)
- 支持 `subagentOnlyExtensions` 的 [pi-subagents](https://www.npmjs.com/package/pi-subagents)
- 支持 Mermaid 的 Markdown 阅读器，例如 Obsidian
- `svg-maker` 所需的本地渲染器：推荐 `rsvg-convert`（macOS 安装 `brew install librsvg`）；`magick` 仅作为可选备用，不必同时安装
- `image-maker` 所需的 `gpt-image-2-skill` skill

`image-maker` 是条件能力。它必须先确认当前 Pi 环境中存在且能够读取 `gpt-image-2-skill` skill，并且其 CLI 运行时可用（通过 `doctor` 检查确认）。认证通过 `OPENAI_API_KEY` 环境变量、`~/.codex/auth.json` 或共享配置自动解析。真实生成命令的 `--json` 结果决定调用是否成功。不要读取、打印或提交配置中的密钥值。

### SVG 工具加载与验证

`svg-maker` 在自己的配置中显式加载工具实现：

```yaml
tools: write_svg, edit_svg, render_svg, read
subagentOnlyExtensions: ../extensions/visual-tools/tools/svg_tools.ts
```

`tools` 只是一份允许使用的工具名单，不会自动加载工具代码。相对扩展路径从 Agent 文件所在目录解析。主会话的 `visual-tools/index.ts` 不注册工具，也不再依赖旧的 `interactive-subagents` 全局接口。

SVG 运行时只需要已安装的 Pi 和 `librsvg`，不必安装 Mermaid 的 npm 依赖。可运行不调用模型的工具测试：

```bash
rsvg-convert --version
node .pi/extensions/visual-tools/tests/svg-tools.test.mjs
```

测试默认使用 `npm root -g` 下的 Pi；安装在其他位置时设置 `PI_PACKAGE_DIR` 为 Pi 包目录。测试覆盖工具注册、写入/编辑/真实渲染、发布目录、同进程子会话隔离及错误处理。

视觉验收还要求模型实际能看见 PNG，不能只看工具成功文本。2026-10-17 本机 `qoder/Ultimate` 的图片附件与 `read` 图片均不可见；经用户批准，用 `moacode-claude/claude-opus-5` 完成了同图验收与发布。默认模型未改变。若附件不可见，先读预览文本中的路径；仍不可见就停止，不发布未经检查的图片。

`tsconfig.json` 用于 SVG 工具类型检查。安装开发依赖时使用 `npm install --ignore-scripts --legacy-peer-deps`；本地类型检查还需将 `node_modules/@earendil-works/` 中的 `pi-coding-agent`、`pi-ai` 链接到已安装的 Pi 及其依赖，避免复制另一份 Pi。运行 `npx --no-install tsc -p tsconfig.json`。这些链接位于已忽略的 `node_modules` 内，不提交机器路径。

## 注意事项

没有 subagent 时，主会话仍然可以完成教学流程，但会失去研究和视觉生成能力。如果没有 `gpt-image-2-skill` skill 或可用的图片 backend，不能调用 `image-maker`，应改用 Mermaid、SVG 或文字解释。

教学 skill 默认面向一个学习者。如果学习目标或交互方式不同，可以根据需要调整。

## FORK INFO

本项目基于原始 `learn` 项目 Fork。上游项目的基础结构和教学理念保留在本仓库中；本节之后记录本 Fork 的实际修改。

### 当前 Fork 修改总结

- 将 `mermaid-maker` 保持为 Mermaid 源码 Agent：用于依赖图、流程、状态机、树和其他小型关系结构，不负责生成 PNG。
- 将 `svg-maker` 保持为精确图形 Agent：用于坐标、比例、角度、公式、数值和其他确定性几何内容。
- 修复 SVG 工具与当前 `pi-subagents` 的连接：通过 `subagentOnlyExtensions` 加载，替换失效的旧插件接口；采用 Pi 提供的类型与参数 schema，消除原作者机器路径依赖。
- SVG 工具按子会话隔离源文件，并按实际子会话工作目录发布 PNG；增加真实渲染回归测试。
- 补充 `rsvg-convert` 的安装说明：macOS 使用 `brew install librsvg`，提供路径和版本检查，说明它是每台机器需单独安装的本地依赖，ImageMagick 仅为可选备用。
- 新增 `image-maker`：用于大型系统、复杂空间场景、三维结构、视觉隐喻和图片模型更适合表达的教学插图。
- 将 `visualize` skill 升级为三路视觉路由：教学计划必须先选择一个视觉锚点；概念整体模型优先评估图片生成，关系结构使用 Mermaid，精确几何使用 SVG。
- 教学计划必须明确一个视觉锚点，并在详细节点教学前呈现；依赖 DAG 仍使用 Mermaid，但不再算作视觉锚点。图片生成是默认候选路线，只有在不增加理解、可能误导或无法使用时才改用 Mermaid、SVG 或文字，并说明原因。
- `image-maker` 只有在当前环境中检测到可读取的 `gpt-image-2-skill` skill 且其 CLI 运行时可用时才可使用。通过 `doctor` 检查确认 backend 就绪；最终通过生成命令的 `--json` 结果判断调用是否成功。
- 图片生成结果必须被读取和人工检查后才能发布到 `viz/`。
- 暂不增加独立的 `hybrid-visual-maker`；只有在真实课程反复需要“图片主体加精确标注”时，才考虑增加 annotated mode。
- 新增 [`change.md`](change.md)，记录每次修改的日期、内容、测试结果和已知限制。

后续修改 README 时，保持以下顺序和规则：

1. 先维护项目原始说明和当前通用使用说明。
2. 保留 `FORK INFO` 作为 Fork 修改的边界。
3. 将本 Fork 的新增或变更总结写在 `FORK INFO` 后面。
4. 将详细的日期、测试和限制记录在 [`change.md`](change.md) 中。
5. README 和 `change.md` 均使用中文说明新增的 Fork 修改。
