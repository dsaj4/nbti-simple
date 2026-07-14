# ADR-0002: 使用 Vite、React 与 TypeScript 实现首个报告纵向切片

## Status

Accepted

## Context

当前仓库是 clean-room foundation，没有运行时。首个可用页面需要从结构化 `ReportViewModel` 渲染报告，支持舞台状态切换、分享反馈、响应式布局与可重复测试；第一版不需要后端、数据库、认证或服务端渲染。

## Decision

采用 Vite、React 19 与 TypeScript 作为首个模块化单体的前端运行时。报告数据适配保留在 `src/features/report`，页面组合放在 `src/app`，视觉与交互组件放在 `src/ui`。使用 Vitest 与 Testing Library 验证数据边界和核心交互。

## Consequences

### Positive

- 可直接消费现有 TypeScript 契约和 JSON fixture。
- React 足以表达舞台选择、分享状态和渐进式动画，不需要引入更重的框架。
- Vite 保持本地构建、预览与视觉验收链路简单。

### Negative

- 首屏是客户端渲染，暂不解决搜索引擎抓取和服务端数据加载。
- 新增 Node 依赖与构建工具维护面。

### Neutral

- 若未来需要服务端渲染、内容路由或后端能力，需要新 ADR 评估迁移，而不是默认扩大当前栈。

## Alternatives Considered

- 静态 HTML/CSS/JS：体积更小，但结构化状态与组件测试会快速变得松散。
- Next.js：能提供服务端渲染与路由，但首个单页报告不需要这些能力，当前成本偏高。
- Vue：同样可行，但没有比 React 在当前原型模板、测试工具与团队可读性上提供明显优势。

## References

- `docs/architecture-hypotheses.md`
- `contracts/report-view-model.ts`
- `fixtures/minimal-report-case.json`
