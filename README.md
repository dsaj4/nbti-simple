# NBTI Reboot

这是 NBTI 的 clean-room rewrite 起点。它不继承旧项目代码、提交历史、依赖或数据模型。

## 起步顺序

1. 阅读 `CONTEXT.md`。
2. 阅读 `docs/report-design-brief.md` 与 `docs/safety-boundaries.md`。
3. 阅读 `contracts/`，理解当前只保留的业务边界。
4. 用 `fixtures/minimal-report-case.json` 讨论首个纵向切片。
5. 在选定技术栈前，不添加框架、数据库、认证或旧实现。

## 结构

- `docs/`：产品背景、边界与待验证的架构假设。
- `references/`：视觉参考，不是要逐像素复刻的 UI 规范。
- `contracts/`：技术栈无关的业务接口骨架。
- `fixtures/`：最小报告数据示例。
- `src/`：按 app、domain、feature、ui 划分的 React 运行时与报告 UI。
- `tests/`：Vitest 数据边界、报告交互与分享降级回归测试。

当前状态：`REPORT SLICE / BROWSER VERIFIED`。

## 本地运行

Windows 可直接双击根目录的 `start.cmd`，脚本会在缺少依赖时自动安装，并启动开发服务器、打开浏览器。

```powershell
npm.cmd install
npm.cmd run dev
```

## 验证

```powershell
npm.cmd test
npm.cmd run build
```

首个纵向切片已实现 Editorial Stage 报告展示页：数据来自 `fixtures/minimal-report-case.json`，页面支持舞台切换、四维结果、响应式阅读与分享/复制反馈。复杂人物与帷幕是独立图片资产，其余信息保持真实 DOM；桌面与移动端浏览器验收、13 项测试和生产构建均通过。
