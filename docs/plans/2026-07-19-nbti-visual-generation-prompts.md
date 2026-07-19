---
document_id: NBTI-VISUAL-GENERATION-PROMPTS-001
title: NBTI 五个视觉方向生图提示词
status: ready-for-external-generation
lifecycle: design
maturity: exploratory
decision_status: proposed
version: 0.1.0
created_at: 2026-07-19
last_updated: 2026-07-19
owner: NBTI product design
source_of_truth: docs/plans/2026-07-19-nbti-visual-generation-prompts.md
depends_on:
  - docs/plans/2026-07-19-nbti-visual-directions-design.md
  - docs/design-document-standard.md
---

# NBTI 五个视觉方向生图提示词

## 使用说明

本轮内置生图服务返回 `404`，没有生成可保存的图片资产。以下提示词可直接复制到支持参考图的图像生成工具中。

- 每次只生成一张图，按 A → E 串行执行；
- 目标画布统一为 `390 × 844`；
- A 使用 `references/report-design/editorial-stage-primary.png` 作为风格参考；
- B 使用 `references/report-design/paper-puppet-alternative.png` 作为风格参考；
- C、D、E 不附参考图，保持发散；
- 结果封面不放分享按钮，分享按钮由网页代码放在封面之外；
- 若模型无法稳定渲染中文，可保留布局与视觉，不把乱码当作最终资产，后续用 HTML/CSS 覆盖文字。

## A — Editorial Stage 2.0 / 编辑舞台

**参考图：** `references/report-design/editorial-stage-primary.png`

```text
Use case: ui-mockup. Create one production-quality mobile web result-cover mockup at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use the attached reference image only for its mature editorial theater language: warm ivory paper, deep ink, restrained mature red, muted gold, a small teal accent, strong Chinese display typography, framed stage composition, and polished print details. Redesign the meaning for a non-diagnostic product: the user is not judged, ranked, diagnosed, or compared. Show an anonymous abstract stage performer or geometric thinking figure under a soft spotlight, never a celebrity and never a courtroom judge. Render these exact Chinese strings clearly: “NBTI 思维风格报告”, “探路者”, “先走一小步，换取下一条线索”, “在这组复杂情境里，你更常用可逆的小步行动验证方向，再决定是否加码。”, “拆解—联想”, “证据—语境”, “定锚—试探”, “全局—近身”, “只描述你在本组情境中的判断方式”. Make the cover screenshot-ready with a clean hierarchy and generous whitespace. Do not include a share button inside the cover. No rarity, percentages, S/A/B grades, score numbers, ability ranking, personality claims, psychological diagnosis, life advice, celebrity likeness, crowns, medals, certificates, emoji, browser chrome, or dense dashboard. Static composition, accessible contrast, readable Chinese typography.
```

## B — Paper Puppet Workshop / 纸偶工作台

**参考图：** `references/report-design/paper-puppet-alternative.png`

```text
Use case: ui-mockup. Create one production-quality mobile web result-cover mockup at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Use the attached reference image only for clean handmade paper craft language: warm cream paper, oxblood red, deep teal, mustard accents, cut edges, perforated tickets, subtle embossing, and a friendly editorial workshop mood. Avoid childish craft, dirty vintage, circus, or award-certificate symbolism. Show a modular abstract paper figure and movable clue strips to represent a situational thinking style, not a fixed personality. Render these exact Chinese strings clearly: “NBTI 思维风格报告”, “探路者”, “先走一小步，换取下一条线索”, “在这组复杂情境里，你更常用可逆的小步行动验证方向，再决定是否加码。”, “拆解—联想”, “证据—语境”, “定锚—试探”, “全局—近身”, “只描述你在本组情境中的判断方式”. Make a clean 4:5-like screenshot cover within the 390 x 844 screen and place the share action outside the cover. No rarity, percentages, ranks, grades, ability scores, personality diagnosis, life advice, celebrities, crowns, medals, emoji, browser chrome, or card-within-card overload. Keep body text readable, shadows restrained, and all important meaning available without texture.
```

## C — Field Notes / 现场观察档案

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Create one production-quality mobile web result-cover mockup at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. The product should feel like a contemporary field-notes editorial page: warm white paper, ink black, one precise vermilion accent, pencil-gray rules, generous margins, numbered observations, tiny editorial marks, and a calm modern Chinese publication aesthetic. No character illustration is required; use an abstract observation window, route annotations, underlines, and a small geometric identity mark. Render these exact Chinese strings clearly: “NBTI 思维风格报告”, “探路者”, “先走一小步，换取下一条线索”, “在这组复杂情境里，你更常用可逆的小步行动验证方向，再决定是否加码。”, “拆解—联想”, “证据—语境”, “定锚—试探”, “全局—近身”, “只描述你在本组情境中的判断方式”. The result cover should read like a page that can be screenshot and understood without another screen; keep the share button outside the cover. Avoid clinical files, police dossiers, corporate performance dashboards, personality-test language, diagnosis, ability scores, rarity, rankings, celebrities, emoji, excessive cards, heavy shadows, and tiny text. Prioritize semantic hierarchy, quiet confidence, and accessible contrast.
```

## D — Signal Paths / 信号路径

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Create one production-quality mobile web result-cover mockup at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Design an internet-native but calm signal-path composition: deep ink blue or soft graphite background, warm light surface for reading, controlled electric teal, coral, and acid-yellow signal accents, thin route lines, branching nodes, and a single distinctive path symbol. It must not look like cyberpunk HUD, brain scanning, code terminal, game leveling, or scientific measurement. Show an abstract route that takes a reversible small step and gathers a new clue. Render these exact Chinese strings clearly: “NBTI 思维风格报告”, “探路者”, “先走一小步，换取下一条线索”, “在这组复杂情境里，你更常用可逆的小步行动验证方向，再决定是否加码。”, “拆解—联想”, “证据—语境”, “定锚—试探”, “全局—近身”, “只描述你在本组情境中的判断方式”. Make the static cover understandable without animation, keep the share button outside the cover, and use strong text contrast. No percentages, grades, ranks, ability scores, personality claims, diagnosis, life advice, celebrity imagery, emoji, browser chrome, or dense technical widgets.
```

## E — Public Notice / 公共告示与社交海报

**参考图：** 不附参考图，纯文字发散。

```text
Use case: ui-mockup. Create one production-quality mobile web result-cover mockup at exactly 390 x 844 for NBTI, a lightweight situational thinking-style test. Treat the result as a bold contemporary cultural poster or public notice, not a certificate, exam result, political poster, recruitment ad, or personality label. Use high-contrast screen-print layers, warm off-white, charcoal, vermilion, cobalt or deep teal, large Chinese display type, geometric identity symbols, slight registration shift, and generous negative space. The identity must be memorable through typography and a simple symbol rather than a complex illustration. Render these exact Chinese strings clearly: “NBTI 思维风格报告”, “探路者”, “先走一小步，换取下一条线索”, “在这组复杂情境里，你更常用可逆的小步行动验证方向，再决定是否加码。”, “拆解—联想”, “证据—语境”, “定锚—试探”, “全局—近身”, “只描述你在本组情境中的判断方式”. Make a clean screenshot-ready cover and place the share action outside the cover. No rarity, percentages, grades, rankings, ability scores, personality diagnosis, life advice, celebrity likeness, medals, certificates, emoji, browser chrome, or unreadable text density. Preserve clear hierarchy and accessible contrast despite the poster energy.
```

## 交付检查

生成结果返回后逐张检查：

- 画布是否为 390 × 844 或自然等比尺寸；
- “探路者”身份是否比装饰更先被读懂；
- 是否误出现稀有度、等级、能力、诊断或名人暗示；
- “多路者”后续生成时是否保持中性，不表达更优秀；
- 中文文字是否可读，乱码是否需要改由网页代码实现；
- 封面是否可以独立截图，且未把分享按钮画进来；
- A/B 是否保留参考图的设计语法而不是旧报告语义；
- C/D/E 是否在隐喻、材质和信息层级上真正区别于 A/B。
