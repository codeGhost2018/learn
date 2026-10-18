# 修改记录

本文件按日期记录本 Fork 的每次实现修改、行为变化、测试结果和已知限制。之后每次修改都追加到对应日期下，不覆盖已有记录。

## 2026-10-03

### 视觉 Agent 路由

- 新增 `agents/image-maker.md`，用于复杂教学插图，包括大型空间场景、分层系统、视觉隐喻、剖面图和多对象环境。
- 保留 `mermaid-maker`，用于小型关系结构；保留 `svg-maker`，用于确定性的几何、坐标、公式和数值图形。
- 更新 `skills/visualize/SKILL.md`，加入 Mermaid、SVG、图片生成三路路由、结构化 brief、图片嵌入和验证边界。
- 保留教学依赖 DAG 使用 Mermaid。图片生成场景只负责辅助理解，不能替代精确的知识依赖关系。
- 暂不新增独立的 `hybrid-visual-maker`。只有真实课程反复需要“图片主体加精确标注”时，才考虑增加 annotated mode。

### Pixeltamer 集成

- 将 `image-maker` 设为条件能力：只有当前 Pi 环境中存在且能够读取 `pixeltamer` skill 时才能使用。
- 将 backend 判断改为使用 Pixeltamer 实际生成命令的 `--json` 结果，不再把 `pixeltamer doctor` 作为硬门槛。
- 确认 Pixeltamer 在加载以下配置后可以使用第三方图片 API：
  `/Users/tim.zl/.config/pixeltamer/.env`
- 确认配置包含 `OPENAI_IMAGE_API_KEY`、`OPENAI_IMAGE_BASE_URL`、`OPENAI_IMAGE_MODEL` 和 `PIXELTAMER_BACKEND` 这些变量名，但没有记录或暴露变量值。
- 成功生成并人工检查复杂的网页请求生命周期教学图：
  `viz/viz-web-request-lifecycle-1791021903.png`
- 该图片为 1536x1024 PNG，包含浏览器、DNS、网络/CDN 层、网关、应用服务器、缓存、数据库、请求路径和响应路径。

### 文档

- 重写 `README.md`，去除过时的 Fork 迁移说明和已经不存在的 Mermaid 模型细节。
- 恢复并固定 `FORK INFO` 区域，用于说明本项目基于上游项目 Fork 的事实。
- 在 `FORK INFO` 后增加当前 Fork 的修改总结。
- 在 `README.md` 中引用本文件。
- 规定 README 和本文件中新增的 Fork 修改说明统一使用中文。

### 已知限制

- Pixeltamer 的 Bash dispatcher 可能在加载自己的 `.env` 之前就进行 backend 选择。调用方需要确保 Pixeltamer skill 的配置已经加载到当前进程，或者使用能够正确处理该配置的封装调用。
- `viz/viz-web-request-lifecycle-1791021903.png` 是本次本地测试生成的图片。是否将它作为示例资产提交到仓库，需要单独决定。

### 配置检测修正

- 修正 `image-maker` 和 `visualize` 的 Pixeltamer 前置检测。
- 检测条件改为二选一：`pixeltamer doctor` 报告可用 backend，或 Pixeltamer 配置文件存在且包含受支持的配置项。
- 支持通过 `$HOME/.config/pixeltamer/.env` 配置第三方模型源，即使 `doctor` 因未看到导出的环境变量而报告没有 API Key，也允许继续尝试。
- 真实生成命令的 `--json` 结果仍然是最终成功判断；失败时不得伪造图片或路径。
- README 的 Fork 修改总结已同步更新。

### 文档维护约定

- README 保持“项目原始说明 → `FORK INFO` → 当前 Fork 修改总结 → `change.md` 引用”的顺序。
- Fork 新增或修改内容先在 README 的 `FORK INFO` 后用中文做总结，再在 `change.md` 中按日期记录详细变化、测试结果和已知限制。
- 后续 README 与 `change.md` 的 Fork 修改说明统一使用中文。

## 2026-10-06

### 教学视觉锚点

- 将视觉锚点纳入每节课的教学计划：计划阶段必须明确学习者先看什么、视觉要帮助注意什么，以及选择图片、Mermaid、SVG 或文字的理由。
- `image-maker` 成为概念整体模型的默认候选路线；它会在详细知识节点讲解前呈现。教学依赖 DAG 仍由 Mermaid 表达，但不再替代视觉锚点。
- 放宽 `image-maker` 的适用范围：概念整体模型、系统概览、物理类比和视觉隐喻，即使场景不复杂，也可以使用图片作为教学入口。
- 保留 Mermaid 和 SVG 在精确关系、位置、数值、角度和公式上的职责，避免用图片表达需要权威读取的细节。

### Pixeltamer 前置检查

- `image-maker` 和 `visualize` 不再运行 `pixeltamer doctor`。
- 前置检查只确认 `pixeltamer` Skill 可读、Pixeltamer 配置文件可读且包含受支持的变量名；不读取或输出密钥值。
- `image-maker` 不调用 Pixeltamer Bash dispatcher，而是直接调用 API backend helper 的 `--json` 接口。这样第三方 API 配置会由 API helper 从 `.env` 加载，避免 dispatcher 在加载 `.env` 前选择 backend。
- 真实图片生成命令的 `--json` 结果仍是最终成功判断。项目 Agent 明确覆盖全局 Pixeltamer Skill 中的 doctor 前置步骤，以支持从 `.env` 加载第三方 API 配置。

### 验证

- 检查了项目 Skill、Agent、README 和变更记录中的 doctor 引用与规则一致性。
- 检查了 Pixeltamer API backend 源码：它会自动读取当前目录、`~/.config/pixeltamer/.env` 等配置文件，并通过环境变量读取 API 配置。
- 未执行真实图片生成；本次变更只调整 Skill/Agent 路由和前置检查规则。

## 2026-10-08

### 图片生成后端迁移

- 将 `image-maker` 的图片生成后端从 `pixeltamer` 迁移到 `gpt-image-2-skill`。
- 更新 `agents/image-maker.md`：前置检查改为运行 `gpt-image-2-skill` 的 `doctor` 命令；生成命令改为 `node <skill-dir>/scripts/gpt_image_2_skill.cjs --json images generate ...`；移除 Pixeltamer 特有的 dispatcher/helper 区分和 `.env` 加载逻辑。
- 更新 `skills/visualize/SKILL.md`：`image-maker` 前置检查和调度说明改为引用 `gpt-image-2-skill`。
- 更新 `README.md`：依赖说明和 Fork 修改总结中的 `pixeltamer` 引用改为 `gpt-image-2-skill`。
- 认证方式从 Pixeltamer 的 `.env` 配置改为 `gpt-image-2-skill` 的自动解析：`OPENAI_API_KEY` 环境变量、`~/.codex/auth.json` 或共享配置。
- 保持相同的工作流程结构、输出契约和验证边界；教学效果不变。

### 已知差异

- `gpt-image-2-skill` 的 `doctor` 命令可以正常运行，不再需要像 Pixeltamer 那样跳过 doctor 检查。
- 移除了 Pixeltamer 的 Bash dispatcher 与 API helper 区分逻辑；`gpt-image-2-skill` 的 Node wrapper 统一处理所有调用。
- 未执行真实图片生成测试；需要在实际教学场景中验证生图效果。

## 2026-10-17

### SVG 子 Agent 工具修复

- 安装 Homebrew `librsvg`，确认 `rsvg-convert 2.63.3` 可将 SVG 渲染为 PNG；不安装 ImageMagick。
- 在 `agents/svg-maker.md` 增加 `subagentOnlyExtensions`，显式加载 `tools/svg_tools.ts`，保留严格工具名单并采用 `systemPromptMode` 字段。
- 移除项目扩展入口对 `globalThis.__pi_interactive_subagents.registerToolExtension` 的依赖。入口保持无工具注册，避免把子 Agent 绘图能力暴露给主会话。
- SVG provider 改用 Pi 提供的 schema 和 `defineTool`；不再依赖旧的 `@sinclair/typebox` 运行时。
- 将 SVG 源文件状态移入扩展工厂，临时目录使用唯一标识；避免多个 SDK 子会话共用进程时互相覆盖源文件。
- 发布目录改用工具上下文的 `cwd`，文件名增加随机后缀，减少同毫秒发布碰撞；渲染失败明确返回 `isError`。
- 清理依赖清单中原作者电脑上的 Pi 绝对路径，重新生成锁文件，增加 Node 类型依赖及 SVG 类型检查配置；本地 host 类型链接仅存在于忽略的 `node_modules` 中。

### 验证

- 无模型测试 4 项通过：工具注册与主会话无工具暴露；写入、精确编辑、PNG 预览及发布；同进程会话隔离；缺少源文件、重复匹配和错误 SVG 的失败处理。
- SVG 的严格 TypeScript 编译检查通过。
- 已确认 `pi-subagents` 将相对 provider 路径解析到正确文件。
- 真实 `svg-maker` 运行已成功调用 `write_svg`、`edit_svg`、`render_svg` 和 `read`。但当前 `qoder/Ultimate` 会话中的预览附件和直接读取图片均未向模型提供可见像素；子 Agent 如实停止，没有发布未经目视检查的 PNG。此结果确认工具加载修复，不代表完整视觉验收通过。
- 在写入和预览的模型可见文本中补充源文件及 PNG 路径，避免仅放在 `details` 中而导致模型无法定位；补充读取路径后仍不可见时停止的规则与测试。
- 经用户批准，仅为本次视觉验收切换到 `moacode-claude/claude-opus-5`。该会话实际看见原预览、重新渲染预览及发布 PNG，确认中文字、直角标记、边标签与布局正确；完整渲染/查看/发布链路通过。
- 发布测试图为 `viz/viz-svg-tools-smoke-test-1792289775506-1e8f3b00.png`（相对学习项目根目录），1280×800 PNG；与第一轮原预览的文件字节完全一致。没有重新设计图形、改变默认模型或替换课程图片。
- `qoder/Ultimate` 的图片不可见问题仍未修复；未来视觉验收应使用实际可见图片的模型或明确停止，不能仅凭模型配置声明支持图片就认定可以目视检查。

### 范围与限制

- 本次不替换已经生成的微积分课程插图，也不修改图片生成或 Mermaid 源码 Agent。
- 旧版 Mermaid PNG provider 仍保留，但没有迁移或执行其浏览器渲染测试。
- Homebrew 安装时同步安装或升级了 `librsvg` 的绘图、字体等依赖。

### README 安装说明补充

- 在 README 的安装章节增加独立的 SVG 渲染器安装步骤，明确 `rsvg-convert` 由 `librsvg` 提供，不随 Pi 或仓库克隆自动安装。
- 提供 macOS 的 `brew install librsvg` 命令、`command -v rsvg-convert` 与版本检查，以及 PATH 排查提示。
- 明确无需同时安装 ImageMagick，仅使用 Mermaid 源码 Agent 时无需此依赖。
- 文档通过 Markdown 检查与 `git diff --check`；本次不执行 Git 提交。
