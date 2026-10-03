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
