---
document_id: NBTI-HOME-GENERATION-PROMPTS-001
title: NBTI 五个视觉方向主页生图提示词
status: ready-for-external-generation
lifecycle: design
maturity: exploratory
decision_status: proposed
version: 0.1.0
created_at: 2026-07-19
last_updated: 2026-07-19
owner: NBTI product design
source_of_truth: docs/plans/2026-07-19-nbti-home-generation-prompts.md
depends_on:
  - docs/plans/2026-07-19-nbti-visual-directions-design.md
  - docs/plans/2026-07-19-nbti-visual-generation-prompts.md
  - docs/design-document-standard.md
---

# NBTI 五个视觉方向主页生图提示词

## 使用说明

本文件为五个视觉方向分别定义一个移动端主页示例。它与结果页提示词使用相同产品边界和画布，目的是比较用户能否在首屏理解“这是什么、要多久、完成后得到什么”。

- 每次只生成一张图，按 A → E 串行执行；
- 目标画布统一为 `390 × 844`；
- A 使用 `references/report-design/editorial-stage-primary.png` 作为风格参考；
- B 使用 `references/report-design/paper-puppet-alternative.png` 作为风格参考；
- C、D、E 不附参考图，保持发散；
- 不生成浏览器或手机外壳；
- 若模型不能稳定渲染中文，保留版式和视觉，后续由 HTML/CSS 写入精确文案；
- 主按钮必须是明显、常规、可点击的“开始测试”按钮，不把 CTA 做成难以点击的装饰票根。

## 统一内容与禁区

每张主页必须以可读中文呈现以下内容：

- 品牌：`NBTI`；
- 主标题：`在复杂现场里，你通常先抓住什么？`；
- 说明：`完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。`；
- 元信息：`约 5 分钟 · 无需登录 · 不上传答案`；
- 主按钮：`开始测试`；
- 边界说明：`不是心理诊断，也不评定人格或能力。`。

每张图都禁止出现：

- 稀有度、百分比、S/A/B 等级、分数、排名或能力值；
- “测出真实人格”“天生如此”“准确率”等话术；
- 医疗、心理咨询、脑扫描、职业建议或人生建议语义；
- 名人、授权背书、王冠、奖章、证书；
- emoji、乱码、问号占位、浏览器外壳、密集 SaaS 仪表盘；
- 卡片套卡片、大面积玻璃拟态或依赖动画才能理解的首屏。

## A — Editorial Stage 2.0 / 编辑舞台

**参考图：** `references/report-design/editorial-stage-primary.png`

```text
Use case: ui-mockup. Direction A — Editorial Stage 2.0. Create one production-quality mobile web homepage at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use the attached reference only for its mature editorial theater language: warm ivory paper #F7F1E8, deep ink #20211F, restrained mature red #BA3026, muted gold #A77C3D, a tiny teal accent #169D96, Chinese display typography, stage framing, and polished print texture. Redesign it into a welcoming opening scene: an empty stage with a few abstract clues, soft branching light, and a sense that different people can notice different things. Do not use a judge, courtroom, celebrity, ranking or award symbolism. Render exact readable Chinese text: “NBTI”, “在复杂现场里，你通常先抓住什么？”, “完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。”, “约 5 分钟 · 无需登录 · 不上传答案”, “开始测试”, “不是心理诊断，也不评定人格或能力。”. Make the primary action visually obvious and conventionally clickable. Let the red curtains frame rather than dominate the page. Strong hierarchy, generous whitespace, accessible contrast, static image, no browser or device chrome. No scores, rarity, percentages, grades, personality claims, diagnosis, ability evaluation, life advice, celebrities, crowns, medals, certificates, emoji, dense dashboard, or nested cards.
```

## B — Paper Puppet Workshop / 纸偶工作台

**参考图：** `references/report-design/paper-puppet-alternative.png`

```text
Use case: ui-mockup. Direction B — Paper Puppet Workshop. Create one production-quality mobile web homepage at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use the attached reference only for clean handmade paper-craft language: warm cream paper #F6EEDF, oxblood red #A83D31, deep teal #1D6664, mustard #C28A33, precise cut edges, subtle embossing, paper fibers, and a friendly editorial workshop mood. Show an opened paper test kit with twelve small neutral clue slips and one large central observation window; it should feel like arranging possible approaches, not a childish craft class. Render exact readable Chinese text: “NBTI”, “在复杂现场里，你通常先抓住什么？”, “完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。”, “约 5 分钟 · 无需登录 · 不上传答案”, “开始测试”, “不是心理诊断，也不评定人格或能力。”. The CTA is a clear red label button with normal button proportions, not a fragile ticket perforation. Keep the layout sparse, readable, tactile but not dirty or nostalgic. No circus, awards, rankings, scores, personality diagnosis, ability evaluation, celebrity likeness, emoji, browser chrome, excessive shadows, or card-within-card collage.
```

## C — Field Notes / 现场观察档案

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Direction C — Field Notes. Create one production-quality mobile web homepage at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Make it feel like the cover and first spread of a contemporary Chinese field-notes publication: warm white #FAF7F0, ink black #20211F, a single vermilion mark #B94235, pencil-gray rules, page numbers, editorial annotations, broad margins, calm confidence, and high-quality Chinese typography. Use an abstract observation window showing one complex scene splitting into several equally valid points of attention. No character illustration is necessary. Render exact readable Chinese text: “NBTI”, “在复杂现场里，你通常先抓住什么？”, “完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。”, “约 5 分钟 · 无需登录 · 不上传答案”, “开始测试”, “不是心理诊断，也不评定人格或能力。”. The action should be a simple, obvious button integrated into the editorial composition. Favor reading clarity and a quiet first-screen rhythm over decorative elements. No police dossier, medical file, corporate performance report, scores, rarity, diagnosis, personality language, rankings, celebrity, emoji, browser chrome, excessive cards, or tiny unreadable notes.
```

## D — Signal Paths / 信号路径

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Direction D — Signal Paths. Create one production-quality mobile web homepage at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Design a calm, internet-native first screen around one signal moving through several possible routes: deep ink blue #17212B or soft graphite, a warm light reading surface, controlled electric teal #38D7C9, coral #F05A4F, acid yellow #D9D84A, thin route lines, soft nodes, and one clear entry path. The visual must express that the same complex situation can lead to different reasonable first moves. It must not look like cyberpunk HUD, brain scan, code terminal, game level map, or scientific measurement. Render exact readable Chinese text: “NBTI”, “在复杂现场里，你通常先抓住什么？”, “完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。”, “约 5 分钟 · 无需登录 · 不上传答案”, “开始测试”, “不是心理诊断，也不评定人格或能力。”. Keep the CTA high contrast and visibly clickable. The page must be understood without animation and preserve generous space for Chinese text. No scores, percentages, grades, ranking, ability claims, diagnosis, celebrity, emoji, browser chrome, dense technical widgets, or glass-card overload.
```

## E — Public Notice / 公共告示与社交海报

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Direction E — Public Notice. Create one production-quality mobile web homepage at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Treat the first screen as a bold contemporary cultural poster that invites someone into a short self-expression experience, not as a certificate, exam result, political poster, recruitment ad, or personality label. Use high-contrast screen-print layers: warm off-white #F6F0E4, charcoal #20211F, vermilion #D64033, cobalt or deep teal #145E73, geometric symbols, subtle registration shift, large Chinese display type, and generous negative space. Show a central split symbol or stacked type composition that suggests several ways of entering the same scene. Render exact readable Chinese text: “NBTI”, “在复杂现场里，你通常先抓住什么？”, “完成 12 道没有标准答案的情境题，获得一份可解释的思维风格报告。”, “约 5 分钟 · 无需登录 · 不上传答案”, “开始测试”, “不是心理诊断，也不评定人格或能力。”. Make the primary action unmistakable, not merely decorative text. The result should be social-ready yet calm enough for a focused test. No awards, credentials, rarity, scores, rankings, personality diagnosis, ability claims, life advice, celebrity imagery, emoji, browser chrome, or illegible dense typography.
```

## 交付检查

生成主页后逐张检查：

- 用户能否在首屏先读到主标题、约 5 分钟、无需登录和开始按钮；
- 主视觉是否表达“同一复杂现场有不同合理起手方式”；
- A、B 是否只沿用参考图的设计语法，而非旧报告的等级与角色语义；
- C、D、E 是否在隐喻、信息层级和材质上明显不同；
- 边界说明是否仍可见且可读；
- CTA 是否清楚、常规且不被装饰吞没；
- 中文是否可读，乱码是否需要由 HTML/CSS 替代；
- 是否误引入评分、人格、能力、诊断或名人暗示。
