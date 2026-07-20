# ADR-0003: 分离完整题库与 Agent 作答 JSON 契约

## Status

Accepted

## Context

NBTI 当前题目以 TypeScript 构造器维护，适合前端运行，但不适合作为跨语言、跨 Agent 的稳定数据交换格式。未来 Agent 需要读取题目并返回选择，同时产品必须保持确定性计分、版本可追溯、非诊断边界和隐私透明。

如果直接把完整题库发送给 Agent，权重和结果映射会暴露目标信号，Agent 可能为特定结果优化选择。临时拼接 Prompt 又会让版本与错误处理失去统一契约。

## Decision

采用 JSON Schema Draft 2020-12 定义三个独立契约：

1. 完整题库文档；
2. Agent 作答请求；
3. Agent 作答响应。

完整题库 JSON 是题目内容的唯一来源，选项显式保存现有 `SeriesDefinition` 所需的全部四维 weights。题库使用独立的 Schema 版本、内容版本和 SHA-256 内容摘要。前端通过本地解析器严格校验后直接还原现有契约。Agent 请求必须由完整题库生成安全投影，剥离 weights、解释动作、维度和结果类型。Agent 响应只通过稳定的 question/option ID 进入校验层，校验完成后才转换为现有答案索引。

v1 Agent 请求不允许携带用户画像或自由上下文。可选 rationale 与 selection confidence 不参与计分。本 ADR 不授权任何外部模型调用或答案上传。

## Consequences

### Positive

- 题库可被不同语言和 Agent 工具读取；
- Agent 无法直接从权重推断目标结果；
- 版本不匹配和非法选项会在计分前失败；
- 保留现有确定性计分与报告逻辑；
- 不绑定 OpenAI、Kimi 或其他具体模型厂商。

### Negative

- 需要维护 Schema、解析器和跨文档校验；
- JSON Schema 无法单独表达“optionId 必须属于对应 questionId”等全部关系，仍需要业务校验器；
- 未来真正发送用户上下文时，需要重写隐私告知并增加同意流程。

### Neutral

- 当前分享链接仍使用答案索引编码，Agent 协议在进入现有计分前完成 ID 到索引的转换。

## Alternatives Considered

**向 Agent 发送完整题库**

- 拒绝：泄露计分目标，容易造成结果导向作答。

**只规定 Prompt 文本模板**

- 拒绝：缺少机器可校验的字段、版本和失败语义。

**在浏览器生产包中引入 JSON Schema 库**

- 暂缓：12 题内置文档由手写语义解析器处理，避免把完整验证器带入浏览器包。Ajv 2020 已用于测试和构建门禁，真正编译三份 Schema 并校验题库与示例；未来服务端 Agent I/O 边界应直接使用标准验证器。

## References

- [NBTI MVP requirements](../mvp-requirements.md)
- [Question JSON standard design](../plans/2026-07-19-nbti-question-json-standard-design.md)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
