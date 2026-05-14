
# YoudaoTranslator

Alfred 翻译 Workflow，基于 [有道智云大模型翻译 API](https://ai.youdao.com)。

## 工作原理

通过 Alfred Script Filter 调用有道智云「大模型文本翻译」API（子曰翻译 Pro），将翻译结果以 JSON 列表返回给 Alfred 展示。长句翻译结果按标点自动分段，每段可独立复制。

运行环境为 [txiki.js](https://github.com/saghul/txiki.js)，不依赖系统 Node.js 或 PHP。

## 功能

- 中英文自动互翻，支持 `CamelCase` 驼峰短语自动拆分
- 30+ 语种支持（中、英、日、韩、法、俄等）
- 长句翻译按标点分段显示，每段可独立回车复制
- 双击 `⌥ Alt` 翻译选中内容
- `⌘ Command` + `↩︎ Enter` 本地发音，`⌥ Alt` + `↩︎ Enter` 在线发音
- `⇧ Shift` 预览有道网页

## 配置

1. 前往 [有道智云](https://ai.youdao.com) 注册并创建应用
2. 绑定「自然语言翻译服务」→「大模型文本翻译」
3. 在 Alfred Workflow 中填入 `key`（应用 ID）和 `secret`（应用密钥）

## 致谢

- [txiki.js](https://github.com/saghul/txiki.js) - 嵌入式 JS 运行时
- [alfred-workflow](https://github.com/joetannenbaum/alfred-workflow) - Alfred Workflow 工具库
