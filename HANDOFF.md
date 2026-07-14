# NBTI Reboot 报告页接手与续开发计划

> 最后核验：2026-07-14 18:38（Asia/Shanghai）  
> 用途：这是后续 agent 恢复工作的第一入口，同时记录当前事实、保护规则和续开发顺序。

## 1. 恢复时先做什么

1. 先完整阅读本文。
2. 再阅读 `CONTEXT.md`、`docs/report-design-brief.md`、`docs/safety-boundaries.md`、`docs/adr/0002-vite-react-report-slice.md`。
3. 查看 `design-qa.md` 和 `work/qa/` 中的既有视觉证据。
4. 使用命令级安全目录参数检查 Git，不要修改全局 Git 配置：

   ```powershell
   git -c safe.directory=E:/Project/nbti-reboot status --short --branch
   ```

5. 在理解未跟踪现场前，禁止执行 `git clean`、`git reset --hard`、`git checkout -- .` 或任何批量覆盖操作。

## 2. 当前开发目标

继续开发 Editorial Stage（极简场景 / 编辑舞台）结果报告页，把参考图实现为真实可用、数据驱动、响应式且可访问的网页，而不是一张静态海报。

实现原则：

- 页面结构、文字、卡片、按钮、状态和响应式布局使用真实 React/HTML/CSS。
- 普通图标使用一致的图标库或简单 SVG；不使用 emoji 或临时占位符。
- 人物、帷幕、纸偶等复杂且代码复刻会显得生硬的元素才使用独立图片素材。
- 复杂素材遵守 `draw-ui` 的“参考图 → 重绘 → 抠图清理 → HTML 放置”链路，不把带正文的整张设计图嵌入页面。
- 报告内容由 `ReportViewModel` 和 fixture 驱动，不在 UI 中硬编码整个结果。
- 保持趣味表达、非心理诊断、非人物授权或背书的产品边界。

视觉真值：`references/report-design/editorial-stage-primary.png`（1586 × 992）。  
备选方向：`references/report-design/paper-puppet-alternative.png`（1586 × 992）。

## 3. 已确认的当前状态

### 3.1 技术与架构

- 已选定 Vite 6、React 19、TypeScript 7 和 Vitest；决定记录在 `docs/adr/0002-vite-react-report-slice.md`。
- 应用入口 `src/app/App.tsx` 已把结构化 fixture 接入 `ReportPage`。
- 数据适配和完整性校验位于 `src/features/report/reportData.ts`。
- UI 按 `src/ui/report/` 下的页面、舞台、解释面板、分享按钮和品牌标记拆分。
- 当前是单页前端纵向切片；暂不包含后端、认证、数据库、CMS 或服务端渲染。

当前结果专属展示元数据已移入 `ReportViewModel`：英文角色名、维度缩写、能力摘要选择、票根眉题和 cameo 视觉素材均由 fixture 提供。UI 对旧数据仍有通用降级，不再依赖 `DLAH`、`self` 或 `socratic` 等固定 ID。

### 3.2 已实现的报告页能力

- Editorial Stage 主舞台与右侧解释面板。
- 结果身份、编码、四个维度、稀有度、解释文案和安全提示。
- “本尊幕 / 追问幕”等舞台 tab 切换，包含点击和键盘方向键操作。
- 分享渐进降级：原生分享 → Clipboard API → selection copy → 可选择的只读报告链接。
- 桌面双栏与移动端单栏响应式布局。
- 语义标题、meter、tab 角色、焦点样式、图片替代文本、live feedback 和 reduced-motion 处理。

关键文件：

- `src/ui/report/ReportPage.tsx`
- `src/ui/report/StageCard.tsx`
- `src/ui/report/InsightPanel.tsx`
- `src/ui/report/ShareButton.tsx`
- `src/ui/report/report.css`
- `fixtures/minimal-report-case.json`
- `contracts/report-view-model.ts`

### 3.3 复杂视觉素材

- `public/assets/judge.png`：透明的主舞台角色素材，929 × 1937。
- `public/assets/curtains.png`：透明帷幕素材，996 × 650。
- `public/assets/philosopher.webp`：由 2048 × 2048 绿幕源图清理得到的透明 WebP，946 × 1908，约 176 KB。
- `references/generated-assets/`：生成源图、参考裁图、提示词和输出元数据；不会进入生产包。

`public/assets/` 现在只保留 `judge.png`、`curtains.png` 和 `philosopher.webp` 三个运行时素材。Vite 构建后的图片发布总量从约 11.6 MB 降至约 2.95 MB，生成追溯资料没有删除。

### 3.4 `draw-ui` 技能状态

- 项目级技能实际存在于 `.codex/skills/draw-ui/`，`SKILL.md` 和还原脚本均可读取。
- 最新 active skill inventory 已收录 `E:\Project\nbti-reboot\.codex\skills\draw-ui\SKILL.md`。
- `skill-change-log.md` 已记录 2026-07-14 的项目级安装与安装后复扫。
- 结论：`draw-ui` 已安装并登记，不要重复安装或覆盖。
- `.codex/` 是本机项目工具目录，包含 provider 专用配置，已加入 `.gitignore`，不会发布到公开仓库。
- 只有发生安装、更新、迁移、删除或状态改变时，才重新走 `skill-registry-control` 的变更日志和扫描流程。

## 4. 本轮核验结果

### 4.1 自动化基线（本轮独立重跑）

2026-07-14 18:38：

- `npm.cmd run test`：通过，2 个测试文件、13 个测试全部成功。
- `npm.cmd run build`：通过，TypeScript project build 与 Vite production build 均成功。
- `node_modules/`、`package-lock.json` 和 `dist/` 当前存在。

测试覆盖：

- 报告数据完整性、四维数量、分数范围和安全提示。
- 关键报告内容渲染。
- 舞台 tab 切换与键盘操作。
- 原生分享、剪贴板和受限浏览器下的多级分享降级。

### 4.2 视觉 QA 证据

下列文件已确认真实存在：

- `work/qa/desktop-1586x992-final.png`
- `work/qa/mobile-390x844-final.png`
- `work/qa/mobile-panel-390.png`
- `work/qa/mobile-share-390.png`
- `work/qa/comparison-full.png`
- `work/qa/comparison-stage.png`
- `work/qa/comparison-panel.png`

`design-qa.md` 的结论仍为 passed。2026-07-14 17:39–18:38 已用独立浏览器重新完成桌面 1586 × 992 和移动端 390 × 844 验收：页面无错误覆盖层或 page error、图片全部加载、移动端无横向溢出，鼠标与 ArrowLeft / ArrowRight tab 切换均有效。

本轮新增证据包括 `work/qa/current-desktop-final-default.png`、`work/qa/current-desktop-final.png`、`work/qa/current-mobile-final-question.png` 和 `work/qa/current-compare-final/`。这些证据仍位于被忽略的 `work/`，不是 Git 可恢复资产。

已知证据细节：名为 `mobile-390x844-final.png` 的文件实际尺寸是 375 × 812；其他两张 mobile 分区截图为 390 × 844。复验时应统一使用并明确记录真实 viewport。

### 4.3 文档漂移

- `README.md` 已同步当前 React 运行时、Vitest 回归测试和浏览器验收状态。
- `CONTEXT.md` 已注明 ADR-0002 选定的 Vite / React / TypeScript 前端栈，同时保留其余产品与架构决策的可变性。
- `tests/README.md` 已同步当前覆盖范围，并保留 quiz / scoring 落地后的确定性测试待办。

## 5. Git 与恢复风险（最高优先级）

当前分支是 `main`，仓库只有一个基线提交：

```text
4c279a7 chore: establish clean-room reboot foundation
```

当前没有 remote，也没有 upstream。报告页成果尚未形成恢复提交：

- `README.md` 是已跟踪但未提交的修改。
- Vite/React 实现、测试、素材、ADR、QA 记录和 `.codex/skills/draw-ui` 等约 42 个文件仍是未跟踪状态。
- 当前无暂存文件。
- `work/`、`dist/`、`node_modules/`、`.npm-cache/` 被 `.gitignore` 忽略；其中 `work/qa/` 的截图不是 Git 可恢复证据。

因此必须遵守：

1. 不执行任何会丢弃未跟踪文件或工作区改动的命令。
2. 不覆盖 `.codex/skills/draw-ui`、`public/assets/` 或 `src/ui/report/`。
3. 后续修改前先读取目标文件并检查当前 diff。
4. 在用户确认当前纵向切片可作为检查点后，再有意地确定暂存范围并创建恢复提交；不要擅自提交。
5. 如果视觉 QA 截图需要长期保留，应决定将精选证据移出被忽略的 `work/`，或调整忽略策略，而不是假设它们已进入版本历史。

只读沙箱账户可能触发 Git `dubious ownership`；使用上面的单命令 `safe.directory` 参数即可。还可能看到无法读取 Administrator 全局 ignore 的警告，这不代表仓库损坏。

## 6. 续开发计划

### 阶段 A：保护并重建可验证现场

目标：在修改视觉前确保当前成果可重复运行、可比较、不会丢失。

- 重新检查 `git status`，确认未跟踪成果仍完整。
- 启动 Vite 开发服务器，验证页面和静态素材可加载。
- 记录本轮浏览器 URL、viewport、页面状态和控制台结果。
- 在用户认可当前检查点后，讨论是否暂存并提交现有纵向切片。

完成条件：当前页面可运行；未跟踪文件得到明确保护方案；没有未解释的运行错误。

### 阶段 B：桌面与移动端视觉复验

目标：用真实浏览器重新验证现有页面，而不是直接相信旧 QA 文档。

- 桌面使用 1586 × 992，对照 `editorial-stage-primary.png`。
- 移动端固定使用 390 × 844，并分别检查舞台、解释面板和分享降级状态。
- 检查资源加载、横向溢出、文字换行、舞台比例、tab 状态、键盘操作与控制台。
- 使用 `draw-ui/scripts/compare_mockup.py` 做全视图与 stage/panel 分区对照，同时人工检查字体和换行。
- 形成按 P0–P3 排序的差异清单；无差异也要记录复验时间和截图。

完成条件：没有 P0–P2 视觉或交互问题；viewport 与证据尺寸一致；测试和构建仍通过。

### 阶段 C：只处理有证据的精修项

本轮已完成：

- 高分辨率哲学家透明 WebP 已替换低分辨率参考裁图。
- 人物资产、英文角色名、能力摘要、票根眉题和维度字母已移出组件硬编码。
- 生成源文件已移出 `public/`，生产包只发布三个实际运行时图片。
- 舞台第三条“衡量人文”已绑定人文维度，修复原先错误显示敏捷解释的问题。
- README / CONTEXT 中的“空边界、未来测试、技术栈未定”描述已同步。

剩余 P3 候选项：

- 在最终品牌字体方向确定后，微调桌面中文标题宽度、字重与换行。
- 若视觉复验发现真实差异，再按页面宽度 → 字体 → 文本块 → 颜色/纹理的顺序调 CSS。

复杂素材必须优先使用内置 image generation，并遵循项目 `draw-ui` 规范；生成前先保存提示词和参考路径，接入前检查透明边缘、绿边、裁切、移动端清晰度和文件体积。

完成条件：修改有对比证据；不引入新的硬编码或复杂 CSS 造型；运行时只发布实际需要的素材。

### 阶段 D：确认报告页之后的产品里程碑

报告页是目前完成度最高的纵向切片，但 `CONTEXT.md` 中的完整主线还包括系列入口、情景题、评分、报告和后续探索。报告页通过用户视觉验收后，再由用户选择：

- 继续扩展更多报告结果与数据；或
- 向前实现 quiz/scoring，打通首个端到端旅程；或
- 先做部署与分享链接的真实路由。

在做出该产品选择前，不提前引入登录、CMS、数据库、多系列后台或实时自由生成报告。

## 7. 报告页完成标准

- 页面正文、信息层级、按钮和状态是真实 DOM，不是整图背景。
- 主舞台在 1586 × 992 下与参考方向一致，移动端 390 × 844 无横向溢出或关键裁切。
- 四维报告由 `ReportViewModel` 驱动，能替换 fixture 而不重写页面结构。
- tab、键盘和分享降级真实可用，受限权限下仍能取得可复制链接。
- 非诊断、非授权背书提示可见。
- 无新增控制台错误；单元测试、类型检查和生产构建通过。
- 复杂素材清晰、边缘干净、体积受控、生成记录可追溯。
- 当前有效实现、技能和关键 QA 证据有明确版本保护方案。

## 8. 下一位 agent 的第一项任务

当前报告页阶段 A–C 已完成。下一位 agent 应先保护当前未跟踪成果；在用户确认后选择下一个产品里程碑：增加第二个真实报告结果、向前实现 quiz/scoring，或建立可分享的结果路由与部署。

建议命令：

```powershell
start.cmd
git -c safe.directory=E:/Project/nbti-reboot status --short --branch
npm.cmd run test
npm.cmd run build
npm.cmd run dev
```

## 9. 建议使用的技能

- `windows-cn-agent-ops`：任何 Windows、PowerShell、路径、编码或本地文件操作前使用。
- `brainstorming`：在改变页面方向、功能或产品里程碑前使用；当前审计和文档落盘不代表已批准新的设计方向。
- `frontend-skill-router` → `frontend-design`：实现或精修真实 React 页面时使用。
- 项目级 `draw-ui`：参考图还原、复杂素材拆分、对比脚本和素材清理时使用。
- `imagegen`：确需重新生成复杂人物或装饰图片时使用；不要用它生成带正文的整页 UI。
- `browser:control-in-app-browser` 或 `vercel:agent-browser-verify`：真实桌面/移动端后验验证时使用。
- `skill-registry-control`：只在 `draw-ui` 或其他技能发生安装、更新、迁移、删除、扫描状态变化时使用。

## 10. 本次接手记录

- 已读取交接、Windows 命令安全、技能注册、`draw-ui` HTML 还原、前端路由和前端设计规范。
- 已核验项目级 `draw-ui` 的目录、active inventory 与 change log。
- 已盘点仓库、现有实现、参考图、生成素材、QA 截图、Git 历史与未跟踪现场。
- 已于 2026-07-14 18:38 完成独立桌面/移动端浏览器复验、13 项测试和生产构建，均通过。
- 已修复舞台能力说明错配、票根身份随选中态改变的问题，并补齐键盘与多结果通用渲染回归测试。
- 已将结果专属展示元数据移入报告契约与 fixture；UI 不再依赖固定结果 ID。
- 已用项目 `draw-ui` 流程生成透明哲学家 WebP，并把生成源与参考资料移至 `references/generated-assets/`。
