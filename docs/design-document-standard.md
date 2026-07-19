---
document_id: NBTI-DESIGN-DOC-STANDARD-001
title: NBTI Design Document 标准
status: approved-for-design-exploration
lifecycle: document
maturity: frozen
decision_status: accepted
governance_class: core
version: 1.0.0
baseline_revision: ed885b7
created_at: 2026-07-19
last_updated: 2026-07-19
review_by: 2026-08-19
owner: NBTI product design
author: Codex
reviewers:
  - product
  - design
  - frontend
  - accessibility
approvers:
  - product owner
source_of_truth: docs/design-document-standard.md
supersedes: null
superseded_by: null
---

# NBTI Design Document 标准

## 1. 目的

本标准定义 NBTI 的设计文档应该记录什么、如何区分探索与已确认规范，以及设计如何进入实现、验收和后续变更。

它不是某一家公司的模板复刻。调研未发现一份被全行业统一采用的 Product/UI Design Document 模板；成熟实践更接近一条可追踪的证据链：

```text
用户问题与证据
  → 多方向探索
  → 选择与取舍
  → 冻结规范
  → 实现与验收
  → 版本、迁移与历史
```

NBTI 将这条证据链收进同一个版本化文档体系，避免视觉稿、代码和产品需求各自成为事实来源。

## 2. 规范性语言

文档使用以下词语表示要求强度：

- **必须**：缺失时不能进入下一设计阶段；
- **应当**：默认需要，若不采用必须记录理由；
- **可以**：依产品阶段和证据选择；
- **禁止**：与产品边界或质量底线冲突。

设计文档必须显式标记信息状态：

| 标签 | 含义 |
| --- | --- |
| `FACT` | 已由代码、研究、数据或一手规范证明的事实 |
| `DECISION` | 已由负责人确认、当前实施应遵守的决定 |
| `HYPOTHESIS` | 需要通过原型、研究或实现验证的假设 |
| `DIRECTION` | 可被选择、合并、搁置或淘汰的设计方向 |
| `TODO` | 尚未完成，必须附 Owner 与截止日期 |

没有标签的描述默认只是解释性文本，不自动成为冻结规范。

## 3. 文档治理模型

一个笼统的 `status: done` 无法表达设计、代码、文档和验证的真实进度。NBTI 设计文档必须至少分别记录以下状态轴：

| 状态轴 | 允许值 |
| --- | --- |
| 生命周期 | `define / design / build / document / integrate` |
| 成熟度 | `exploratory / candidate / approved / frozen / implemented / deprecated / superseded` |
| 决策状态 | `proposed / accepted / rejected / parked / merged` |
| 治理分类 | `core / extended / pending / out-of-scope` |
| 证据状态 | `untested / qualitative / quantitative / accessibility-validated` |
| 支持级别 | `none / consult-review / task-specific / end-to-end` |
| 发布影响 | `patch / minor / major` |

还必须分别记录以下一致性状态，不能用一个总勾选代替：

- 文档与需求一致；
- 设计稿与文档一致；
- 可运行原型与设计稿一致；
- 生产代码与规范一致；
- 示例、测试和验收证据与当前版本一致。

`frozen` 表示“形成受变更控制的版本基线”，不表示永远不能修改。

## 4. 标准章节

### 4.1 文档控制卡

必须包含：

- 文档 ID、标题、产品或模块、范围；
- 当前生命周期、成熟度、决策状态；
- 版本、基线 revision、创建与更新时间、下次复审日期；
- Owner、作者、评审者与批准者；
- 唯一事实来源；
- 关联需求、研究、原型、Issue、PR、Figma 或截图；
- `supersedes`、`superseded_by` 和变更日志。

### 4.2 背景与问题

必须回答：

1. 目标用户在什么情境下要完成什么任务；
2. 当前方案为何不足；
3. 这次设计希望改变哪一个可观察结果；
4. 哪些内容属于范围，哪些明确不做；
5. 已知约束、依赖、风险和未知项是什么；
6. 依据来自哪里，研究方法、样本和日期是什么。

### 4.3 设计原则

原则必须能帮助团队在两个合理方案之间作出选择，而不是“简洁、美观、易用”一类空泛形容词。每条原则应包括：

- 原则句；
- 解决的用户风险；
- 对页面或组件的具体影响；
- 与其他原则冲突时的优先级。

### 4.4 方向探索

所有候选方向必须使用同一模板：

| 字段 | 要求 |
| --- | --- |
| Direction ID 与名称 | 稳定 ID，不依赖“方案一”等临时顺序 |
| 核心假设 | 该方向如何改善目标用户结果 |
| 目标场景 | 最适合的用户、设备和进入方式 |
| 产品隐喻 | 用户在使用的东西“像什么”，以及隐喻边界 |
| 信息架构 | 入口、题目、报告与分享的层级 |
| 交互模型 | 关键选择、推进、返回、反馈和恢复 |
| 视觉语言 | 构图、色彩、字体、材质、图像和动效原则 |
| 状态与响应式 | 核心状态、错误、空态及断点重排 |
| 内容语言 | 标题、选项、身份与边界说明的语气 |
| 无障碍假设 | 键盘、焦点、语义、读屏、对比度和动效风险 |
| 实现可行性 | 资产、性能、工程复杂度和维护成本 |
| 证据 | 原型、研究或既有产品证据 |
| 优势、代价、风险 | 必须同时写，不做单向宣传 |
| Disposition | `active / rejected / parked / merged` |

探索稿必须允许被抛弃。提案阶段应优先表达用户需要、结构和证据，不提前把大量时间投入精细代码或完整资产生产。

### 4.5 比较与决策门

比较矩阵至少覆盖：

- 入口理解速度；
- 12 题持续完成能力；
- 结果可认领性；
- 解释可信度；
- 截图与分享表现；
- 产品边界安全；
- 移动端与无障碍；
- 资产与实现成本；
- 扩展到 8+1 身份的维护成本；
- 与既有品牌资产的一致性。

选定方向时必须记录：选择理由、证据强度、被拒或搁置方向、主要权衡、未解除风险、决策人与日期。未选方向保留为设计历史，但不能继续混入冻结规范。

### 4.6 冻结规范

只有被批准的方向才能进入此区。规范必须覆盖：

- 何时使用、何时不使用；
- 页面和组件解剖结构；
- 变体、尺寸、密度、层级；
- 默认、悬停、焦点、按下、选中、禁用、加载、成功、错误、空态；
- 键盘、焦点顺序、手势、播报与动效；
- 响应式断点和重排规则；
- 文案、标签、错误信息、国际化与文本扩张；
- 色彩、字体、间距、圆角、边框、阴影和图像 token；
- 语义、名称、角色、状态和读屏反馈；
- 数据契约与实现组件映射；
- 浏览器、设备和已知限制；
- 可运行示例与显式 TODO。

### 4.7 验收与交付

必须记录：

- 用户研究任务、指标和成功阈值；
- 页面、状态、断点和边界用例；
- 键盘、焦点、读屏、文本替代、对比度和缩放检查；
- 目标浏览器、设备与辅助技术；
- 自动检查与人工验证；
- 需求、设计、代码、文档、demo 和测试的一致性；
- 发布、埋点、迁移、弃用、回滚与沟通方式；
- 遗留问题、Owner 与截止日期。

## 5. NBTI 基础设计规范

以下规则适用于所有视觉方向；方向可以改变表现，不得破坏这些基线。

### 5.1 布局与响应式

- 移动端以 `390 × 844` 为主要设计画布，同时必须在 `320px` 宽度无信息或功能损失；
- 桌面端使用 `1440 × 1024` 作为探索与验收画布；
- 页面应在内容自然断点重排，不为迁就某个设备建立大量设备型号断点；
- 主文本阅读行长目标为 28–36 个中文字符，禁止题干横跨超宽页面；
- 采用 4px 基础单位，常用间距为 `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`；
- 移动端页面边距不小于 16px，核心阅读区优先使用 20–24px；
- 报告截图单位为独立结果封面，操作按钮位于封面之外。

### 5.2 字体

- 正文中文基线不小于 16px，辅助文字不小于 12px；
- 正文行高建议 1.6–1.8，操作文字行高不小于 1.35；
- 单一方向最多使用两个字体家族；
- 字号、字重和留白优先承担层级，颜色与装饰只做辅助；
- 身份名可以使用展示性字体，但核心解释必须保持稳定可读；
- 不把整段关键中文做成图片文字。

### 5.3 色彩与材质

- 每个方向必须定义语义 token，而不是在页面中散落具体颜色；
- 至少包括 `surface / surface-raised / text / text-muted / border / accent / accent-contrast / focus / success / danger`；
- 正文与背景对比度必须达到 4.5:1，大号文字至少 3:1；
- 选中、错误、进度和维度方向不得只靠颜色表达；
- 纸纹、噪点、玻璃或光效不能降低正文可读性，也不能覆盖交互焦点；
- 方向色是视觉标识，不代表维度好坏或能力高低。

### 5.4 交互组件

- 主按钮、选项和核心触控目标的实际可点击区目标为 44 × 44px 以上；WCAG 2.2 AA 的最低基线为 24 × 24px，NBTI 采用更宽裕的产品目标；
- 键盘焦点必须可见，至少形成等效 2px 外周、与相邻颜色 3:1 的清楚指示；
- 选项必须同时呈现文本、形状或图标状态，不能只换背景色；
- 点击选项只选择，不自动跳题；主按钮负责继续，避免误触；
- 动效优先 120–240ms，只用于因果、方向与层级变化；
- 在 `prefers-reduced-motion` 下移除非必要位移、视差和循环动画。

### 5.5 图像与图标

- 复杂主视觉使用独立图片资产；普通图标使用同一成熟图标库；
- 禁止 emoji、占位图、字符画或临时图标进入正式界面；
- 图像只是结果身份的记忆界面，不能暗示名人授权、诊断或等级；
- 装饰图使用空替代文本，传达信息的图必须有等效文字；
- 页面在图片加载失败时仍能完成答题并理解报告。

### 5.6 内容与产品边界

- 统一使用“在这组情境里”“你更常先……”等条件性语言；
- 禁止“真实人格、天生、永远、准确率、稀有度、等级、能力更强”等表达；
- 身份必须是动作型称号，四维必须是双向位置而非高低分；
- “多路者”只表示本组答案没有明显单一方向，不表示均衡、成熟或更优秀；
- 入口与报告都必须可见“非心理诊断、非人格或能力评级”的边界；
- 分享封面保留样本限定，不能在截图中裁掉所有边界信息。

## 6. 方向出图前的最低交付

每个方向进入视觉出图前，必须具备：

1. 一个入口页说明；
2. 一个第 3 题的选中状态；
3. 一个“探路者”结果封面；
4. 一个“多路者”结果封面；
5. 移动端与桌面端构图策略；
6. 色彩、字体、材质、图像、图标和动效说明；
7. 主要风险和禁止项；
8. 使用完全相同的示例数据，以便横向比较。

出图不是最终规范。图中出现的文字、对比度、状态和尺寸仍需通过可运行原型验证。

## 7. 决策与冻结门槛

候选方向进入冻结规范前必须满足：

- 五个方向使用同构资料完成评审；
- 选择与淘汰理由有记录；
- 入口、题目、结果、无效链接和分享降级有完整状态；
- 移动端、桌面端和 320px 回流策略明确；
- 键盘、焦点、语义和读屏方案明确；
- 8 个方向身份与“多路者”均有可扩展的视觉规则；
- 主要图片资产的生产方式和预算明确；
- 可运行原型通过设计与可访问性评审；
- 需求、设计、代码、文档和 demo 的差异为零，或存在已批准的显式例外；
- 所有 TODO 都包含 Owner 与日期。

## 8. 变更规则

冻结后的修改必须记录：

- 修改原因与范围；
- 相对基线的可见差异；
- 受影响页面、组件和消费者；
- 用户、内容、无障碍和技术风险；
- 发布影响 `patch / minor / major`；
- 评审与批准；
- 必要的迁移、弃用、回滚和沟通；
- changelog 条目。

## 9. 调研来源

本标准综合以下公开一手资料。它们支撑的是方法与治理原则，不代表 NBTI 采用其品牌样式。

- [GOV.UK：提案组件或模式](https://github.com/alphagov/govuk-design-system/blob/main/src/community/propose-a-component-or-pattern/index.md)
- [GOV.UK：贡献标准](https://github.com/alphagov/govuk-design-system/blob/main/src/community/contribution-criteria/index.md)
- [GOV.UK：开发组件或模式](https://github.com/alphagov/govuk-design-system/blob/main/src/community/develop-a-component-or-pattern/index.md)
- [GOV.UK：分享研究发现](https://github.com/alphagov/govuk-design-system/blob/main/src/community/share-research-findings/index.md)
- [GitLab Pajamas：生命周期](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/blob/ee95b69fc333d4335c3a3a5001c1441721321b23/contents/get-started/lifecycle.md)
- [GitLab Pajamas：组件文档模板](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/blob/ee95b69fc333d4335c3a3a5001c1441721321b23/pages/components/template.md)
- [GitLab Pajamas：组件完成清单](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/blob/ee95b69fc333d4335c3a3a5001c1441721321b23/.gitlab/issue_templates/Component.md)
- [Material Web：组件文档示例](https://github.com/material-components/material-web/blob/main/docs/components/button.md)
- [Material Web：贡献流程](https://github.com/material-components/material-web/blob/main/CONTRIBUTING.md)
- [Shopify Polaris：贡献与版本治理](https://github.com/Shopify/polaris-react/blob/main/.github/CONTRIBUTING.md)
- [WCAG 2.2：文字对比度](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/contrast-minimum.html)
- [WCAG 2.2：回流](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/reflow.html)
- [WCAG 2.2：目标尺寸](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/target-size-minimum.html)
- [WCAG 2.2：焦点外观](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/focus-appearance.html)

## 10. 调研限制

- 2026-07-19 的环境无法稳定直接读取部分官方网页，因此优先使用公开官方源文件仓库和固定 revision；
- 本标准没有把无法复核的网页描述写成强制事实；
- 具体视觉数值仍需在 NBTI 原型中用真实中文内容和目标设备验证。

## 11. 变更日志

### 1.0.0 — 2026-07-19

- 基于 GOV.UK、GitLab Pajamas、Material Web、Shopify Polaris 与 WCAG 2.2 的公开一手资料建立文档结构；
- 定义探索、决策门、冻结规范、验收和变更治理；
- 建立适用于 NBTI 所有视觉方向的基础设计规范与出图门槛。
