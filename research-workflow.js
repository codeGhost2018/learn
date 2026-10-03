const result = await runs.run("human-speaking-research", {
  agent: "researcher",
  task: "研究高星、高热度的开源项目或社区方案，让 AI 默认更像人说话、回答更简短、少废话、避免又臭又长。优先查 GitHub、官方项目文档、社区原帖、真实 issue/discussion。覆盖：可安装的 AI agent skill / prompt skill / system prompt 包；Pi、Claude Code、Cursor、OpenAI Codex、Open WebUI、ChatGPT 等相关的高热度配置或提示词项目；社区中被大量引用、收藏或讨论的 concise/human-like response 指令。为每个候选记录名称、链接、截至检索时的星数或热度指标、实际解决的问题、能否控制回答长度和语气、安装/使用方式、局限；优先判断是否适用于当前 Pi。输出一份带原始来源链接的 Markdown 研究报告，最后给出 Top 3 推荐和不推荐理由。不要只依据营销文章。",
  output: "research/human-speaking-skills.md",
  outputMode: "file-only"
});
return result.outputReference ?? result.artifactPaths ?? result;
