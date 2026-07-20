# Test Boundary

当前使用 Vitest 与 Testing Library，覆盖完整答题与报告流程、确定性计分、草稿恢复、分享编码、安全提示，以及题库与 Agent JSON 契约。

`tests/question-json.test.ts` 会使用 Ajv 2020 真正编译三份 JSON Schema，同时校验当前题库、公开请求和响应示例；它还锁定题目矩阵、内容摘要、稳定 ID 与 Agent 安全投影。`npm run build` 会先运行这组契约检查，避免带有过期摘要或失效 Schema 的题库进入发布产物。
