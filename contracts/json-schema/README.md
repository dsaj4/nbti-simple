# NBTI JSON 契约

本目录定义三个相互分离的 JSON Schema（Draft 2020-12）：

- `nbti-questionnaire.v1.schema.json`：站内可信题库，包含题目、解释动作、计分权重与结果类型；
- `nbti-agent-request.v1.schema.json`：发给 Agent 的安全投影，只包含题面与稳定 ID；
- `nbti-agent-response.v1.schema.json`：Agent 的成功或错误响应。

## 数据流

`src/content/nbti-mvp.v1.json` 是当前题目内容的唯一来源。应用启动时由
`src/content/questionnaire.ts` 做结构与跨记录语义校验，再转换成既有
`SeriesDefinition`，因此现有确定性计分、草稿恢复和分享链接保持不变。

未来接入 Agent 时，必须通过 `buildAgentAnswerRequest()` 生成公开请求，不能直接发送
完整题库。Agent 返回的数据必须先经过 `parseAgentAnswerResponse()`；只有完整的
`full-batch` 成功响应才能由 `agentResponseToAnswerIndexes()` 转换为现有计分数组。

## 版本与摘要

- `schemaVersion` / `protocolVersion` 表示字段及语义版本；
- `seriesRef.version` 表示题库内容版本；
- `contentDigest` 绑定同一版本的精确内容。

摘要计算会从根对象移除 `$schema` 与 `contentDigest`，递归按键名排序、将字符串转换为
Unicode NFC，再对 UTF-8 JSON 计算 SHA-256。题目文字、顺序、选项、动作、权重或结果
类型发生变化时，必须发布新的题库版本并重新计算摘要。静态内置题库由
`npm run check:contracts` 校验摘要，且 `npm run build` 会自动先执行该发布门禁；未来若动态
加载外部题库，必须先 `await assertQuestionnaireDigest(input)`，再进入结构解析。

## Agent v1 安全边界

- 请求中不得出现 `weights`、`action`、维度、结果身份或阈值；
- 不接受姓名、用户画像、历史回答、自由上下文或任意 metadata；
- `requestId` 必须通过 `createAgentRequestId()` 生成无语义随机 ID；接入层应一次性消费并拒绝重放；
- Agent 不得做诊断、人格评估或能力评级，理由只能解释当前情境中的选择；
- `rationale` 与 `selectionConfidence` 默认关闭，即使启用也永不参与计分；
- rationale 始终视为不可信文本，不写入报告或默认日志；
- 部分答案、重复答案、错误归属、版本或摘要不匹配一律拒绝，不用默认答案补齐。

JSON Schema 负责通用结构约束；题目 ID 唯一性、当前 12×4 平衡矩阵、完整题集覆盖等
跨记录规则由运行时校验器负责。

## 示例

- `docs/examples/nbti-agent-request.single.v1.json`
- `docs/examples/nbti-agent-response.ok.v1.json`
- `docs/examples/nbti-agent-response.error.v1.json`

更完整的设计理由见 `docs/plans/2026-07-19-nbti-question-json-standard-design.md` 与
`docs/adr/0003-separate-questionnaire-and-agent-json-contracts.md`。
