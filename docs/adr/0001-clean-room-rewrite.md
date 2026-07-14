# ADR-0001: 采用 Clean-room Rewrite

## Status

Accepted

## Context

旧项目包含实验代码、评分 POC、静态报告页、设计探索和多层治理材料。它们有价值，但会把新项目绑定到旧目录、旧假设和旧技术选择。

## Decision

新项目使用独立 Git 历史，只引入策展后的背景材料、设计参考、业务概念和新写的接口骨架。禁止直接复制旧实现代码、测试、依赖和构建配置。

## Consequences

### Positive

- 新架构可以从产品目标出发重新选择。
- 新代码不受历史目录和技术债牵引。
- 迁入范围可通过 allowlist 审核。

### Negative

- 旧 POC 的功能需要重新实现和验证。
- 查询旧细节时需要从 Legacy Vault 取证。

## Alternatives Considered

- 在旧仓库另开重写分支：会持续暴露旧实现并引导复用。
- 清空旧 main 重写：归档与新开发混在一段历史里，恢复和审计困难。
