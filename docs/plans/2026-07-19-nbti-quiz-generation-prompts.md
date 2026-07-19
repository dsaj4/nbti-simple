---
document_id: NBTI-QUIZ-GENERATION-PROMPTS-001
title: NBTI 五个视觉方向题目测试页生图提示词
status: ready-for-external-generation
lifecycle: design
maturity: exploratory
decision_status: proposed
version: 0.1.0
created_at: 2026-07-19
last_updated: 2026-07-19
owner: NBTI product design
source_of_truth: docs/plans/2026-07-19-nbti-quiz-generation-prompts.md
depends_on:
  - docs/plans/2026-07-19-nbti-visual-directions-design.md
  - docs/plans/2026-07-19-nbti-visual-generation-prompts.md
  - docs/design-document-standard.md
---

# NBTI 五个视觉方向题目测试页生图提示词

## 使用说明

本文件为五个视觉方向分别定义一个移动端题目测试页示例。每张图固定使用第 3 题的已选状态，便于比较单题阅读、四个合理选项、进度、返回与继续操作的表现。

- 每次只生成一张图，按 A → E 串行执行；
- 目标画布统一为 `390 × 844`；
- A 使用 `references/report-design/editorial-stage-primary.png` 作为风格参考；
- B 使用 `references/report-design/paper-puppet-alternative.png` 作为风格参考；
- C、D、E 不附参考图，保持发散；
- 第三项必须是已选状态；
- 选择状态必须由勾选、边框、形状或文字等多种线索表达，不能只靠颜色；
- 题目页不显示结果身份、分数、维度位置或任何“正确答案”暗示；
- 若模型不能稳定渲染中文，保留布局与视觉，后续由 HTML/CSS 写入精确文案。

## 统一内容与禁区

每张题目页必须以可读中文呈现以下内容：

- 品牌：`NBTI`；
- 进度：`03 / 12`；
- 标签：`信息现场`；
- 题干：`截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？`；
- 选项 1：`把矛盾拆成可以分别核对的部分`；
- 选项 2：`先确认哪条证据最可能改变结论`；
- 选项 3（已选中）：`做一个可逆的小决定，让事情继续`；
- 选项 4：`先问清不同人会承担什么后果`；
- 次要按钮：`上一题`；
- 主按钮：`下一题`。

每张图都禁止出现：

- 对错标记、标准答案、分数、进度百分比、能力测量或人格结论；
- 稀有度、等级、排名、百分比、排名奖章；
- 题目自动跳转、倒计时、夸张紧急警报或会诱导用户的推荐答案；
- 医疗、心理咨询、脑扫描、职业建议或人生建议语义；
- 名人、授权背书、emoji、乱码、问号占位、浏览器或手机外壳；
- 复杂表格、密集控制台或卡片套卡片；
- 难以辨认的弱对比文字或把继续按钮遮挡在屏幕外。

## A — Editorial Stage 2.0 / 编辑舞台

**参考图：** `references/report-design/editorial-stage-primary.png`

```text
Use case: ui-mockup. Direction A — Editorial Stage 2.0. Create one production-quality mobile web quiz screen at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use the attached reference only for mature editorial theater language: warm ivory paper #F7F1E8, deep ink #20211F, mature red #BA3026, muted gold #A77C3D, tiny teal #169D96, Chinese display typography, fine theatrical framing, and polished print details. Reframe the screen as a neutral short scene, never a courtroom or judgment. Render exact readable Chinese text: “NBTI”, “03 / 12”, “信息现场”, “截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？”, “把矛盾拆成可以分别核对的部分”, “先确认哪条证据最可能改变结论”, “做一个可逆的小决定，让事情继续”, “先问清不同人会承担什么后果”, “上一题”, “下一题”. Show four equally dignified answer choices in a readable vertical list. The third option is selected with a check mark, clear border, and mature red state, never only color. Progress must be visible as “03 / 12” with a restrained linear indicator; it must not imply grading. Keep previous and next buttons visible in the normal lower flow. No correct answer, scores, personality claims, diagnosis, ranking, rarity, celebrity, crowns, medals, emoji, browser chrome, heavy dashboard, or nested cards.
```

## B — Paper Puppet Workshop / 纸偶工作台

**参考图：** `references/report-design/paper-puppet-alternative.png`

```text
Use case: ui-mockup. Direction B — Paper Puppet Workshop. Create one production-quality mobile web quiz screen at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use the attached reference only for refined paper craft and editorial workshop language: cream paper #F6EEDF, oxblood red #A83D31, deep teal #1D6664, mustard #C28A33, clean cut edges, subtle embossing, light stitching, and controlled paper texture. The page is one focused worktable scene, not a childish scrapbook. Render exact readable Chinese text: “NBTI”, “03 / 12”, “信息现场”, “截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？”, “把矛盾拆成可以分别核对的部分”, “先确认哪条证据最可能改变结论”, “做一个可逆的小决定，让事情继续”, “先问清不同人会承担什么后果”, “上一题”, “下一题”. Treat the four responses as equally sized paper strips with clear reading order and generous touch space. The third response is selected using a pressed seal, check mark, border, and slight elevation, not color alone. Make “03 / 12” visible alongside a simple 12-step binding marker. Keep the lower navigation clear and conventional. No implied right answer, grades, scores, rarity, diagnosis, personality label, celebrity, emoji, browser chrome, dirty texture, excessive shadows, or card-within-card collage.
```

## C — Field Notes / 现场观察档案

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Direction C — Field Notes. Create one production-quality mobile web quiz screen at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use a calm contemporary Chinese editorial field-notes layout: warm white #FAF7F0, ink black #20211F, one vermilion accent #B94235, pencil-gray rules, precise page numbering, wide margins, subtle annotations, and a strong reading rhythm. Render exact readable Chinese text: “NBTI”, “03 / 12”, “信息现场”, “截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？”, “把矛盾拆成可以分别核对的部分”, “先确认哪条证据最可能改变结论”, “做一个可逆的小决定，让事情继续”, “先问清不同人会承担什么后果”, “上一题”, “下一题”. Present the four choices as editorial annotation rows with equal prominence. The third row is selected through a check mark, a red edge rule, a filled index marker, and a clear border. Use “03 / 12” and a quiet linear progress rule; no percentage. Keep the page simple enough for focused reading and normal bottom navigation. No police dossier, medical form, corporate KPI dashboard, answer correctness, score, diagnosis, personality claim, ranking, celebrity, emoji, browser chrome, tiny notes, or excessive cards.
```

## D — Signal Paths / 信号路径

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Direction D — Signal Paths. Create one production-quality mobile web quiz screen at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Create a calm internet-native decision surface with deep ink blue #17212B or soft graphite, one warm light reading area, controlled electric teal #38D7C9, coral #F05A4F, acid-yellow #D9D84A, thin routes, small nodes, and restrained ambient glow. It must not resemble a cyberpunk HUD, code terminal, brain scan, scientific measurement, or game skill tree. Render exact readable Chinese text: “NBTI”, “03 / 12”, “信息现场”, “截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？”, “把矛盾拆成可以分别核对的部分”, “先确认哪条证据最可能改变结论”, “做一个可逆的小决定，让事情继续”, “先问清不同人会承担什么后果”, “上一题”, “下一题”. Make a vertical list of four clear textual choices; background route lines may suggest branches but choices must not require spatial interpretation. The third option is selected with a check mark, visible outline, label change, and one illuminated route, not color alone. Show “03 / 12” and a 12-node progress path without percentages or results. Make lower navigation visible and accessible. No correct answer, scores, personality claims, diagnosis, rarity, rank, celebrity, emoji, browser chrome, dense technical widgets, or glass-card overload.
```

## E — Public Notice / 公共告示与社交海报

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Direction E — Public Notice. Create one production-quality mobile web quiz screen at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use a bold but readable contemporary cultural-poster system: warm off-white #F6F0E4, charcoal #20211F, vermilion #D64033, cobalt or deep teal #145E73, simple screen-print layers, precise geometric markers, a slight registration shift, and strong Chinese typography. This is a focused question page, not a political poster, exam sheet, certificate, or personality label. Render exact readable Chinese text: “NBTI”, “03 / 12”, “信息现场”, “截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？”, “把矛盾拆成可以分别核对的部分”, “先确认哪条证据最可能改变结论”, “做一个可逆的小决定，让事情继续”, “先问清不同人会承担什么后果”, “上一题”, “下一题”. Treat the four answers as four balanced declarative lines with a clear vertical reading order. Make the third choice selected through a check mark, contrasting number tile, thick border, and text treatment, never color alone. Present “03 / 12” as a small poster index and a simple progress strip without percentage or score. Keep navigation buttons obvious and within the screen. No right-answer signals, grades, ranks, scores, diagnosis, ability claims, life advice, celebrity, emoji, browser chrome, unreadable dense typography, or nested cards.
```

## 交付检查

生成题目页后逐张检查：

- 首先能否读到题号、现场标签、题干和四个选项；
- 四个选项是否同样合理、同样可选，没有视觉上的“推荐答案”；
- 第三项是否同时通过勾选、边框、形状或文字表达选中状态；
- 进度是否表达完成进程，而非得分、评级或正确率；
- “上一题”和“下一题”是否可见、层级清楚且不遮挡选项；
- A、B 是否只沿用参考图的设计语法，而非旧报告的审判、等级与人物语义；
- C、D、E 是否在隐喻、材质和信息层级上明显不同；
- 中文是否可读，乱码是否需要由 HTML/CSS 替代；
- 是否误引入评分、人格、能力、诊断、名人暗示或依赖动画的交互。
