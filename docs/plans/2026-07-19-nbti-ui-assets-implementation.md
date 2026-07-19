# NBTI UI 素材生成与实装记录

日期：2026-07-19

## 范围

本轮只生成和实装界面视觉素材，不生成人格、人物、身份角色、结果象征物或测评类型插画。页面中的文字、按钮、题目选项、报告结构和结果图形继续使用真实 HTML/CSS/SVG。

## 采用素材

| 素材 | 用途 | 最终文件 |
| --- | --- | --- |
| 红色舞台侧帷幕 | 主页、题目卡片、报告封面的左右边框；右侧由 CSS 镜像复用 | `public/assets/ui/stage-curtain-ui-final.png` |
| 暖白纸张纹理 | 全站背景的低对比度质感层 | `public/assets/ui/paper-texture-ui.webp` |

帷幕生成源保存在 `work/assets/ui/stage-curtain-chroma-source.png`，便于后续重新抠图或调色。

## 最终生成提示词

### 舞台侧帷幕

> Create one standalone reusable UI decoration asset: a single LEFT theatre stage curtain only. Deep vermilion red velvet, narrow vertical pleats, restrained antique-gold piping and one gold rope tieback, refined Chinese editorial theatre mood, premium but lightweight web UI ornament. Full-height vertical strip, curtain attached to the far left edge and opening toward the right; preserve a clear irregular inner edge. Put the entire asset on a perfectly flat solid chroma-key green background (#00FF00), with no green reflected into the curtain. No people, no faces, no character silhouettes, no personality symbols, no text, no letters, no logos, no buttons, no cards, no page mockup, no scenery. Even lighting, crisp contour, minimal soft shadow, suitable for clean background removal and CSS mirroring. Tall portrait composition.

### 纸张纹理

> Generate a seamless, subtle warm ivory editorial paper texture for a web UI background. Very low contrast, fine natural paper fibers, faint cream-to-warm-white tonal variation, clean and premium, evenly lit, tileable appearance, no visible seams, no vignette, no objects, no borders, no UI mockup, no text, no letters, no logos, no people, no faces, no symbols, no illustrations. The texture should remain nearly flat so dark Chinese typography stays highly readable and WCAG-friendly. Square texture tile.

生成模式：Codex 内置 ImageGen。三张项目参考图仅作为模型输入用于把握界面材质与色调；主执行代理没有读取或比对参考图内容。

## 实装位置

- `src/ui/global.css`：纸张纹理通过 `body::before` 以低透明度平铺。
- `src/ui/home/home.css`：主页左右帷幕使用最终透明 PNG。
- `src/ui/quiz/quiz.css`：题目卡片左右帷幕使用同一素材。
- `src/ui/report/report.css`：报告封面左右帷幕使用同一素材。

帷幕层均为 `pointer-events: none`，不会遮挡按钮或选项；右侧通过 `transform: scaleX(-1)` 镜像，避免重复下载另一份资产。

## 验证结果

- 单元测试：4 个测试文件、32 项测试全部通过。
- 生产构建：Vite 构建通过。
- 静态资源：帷幕 PNG 与纸纹 WebP 在本地预览均返回 HTTP 200。
- 浏览器流程：主页 → 12 道题 → 报告页完整走通。
- 响应式：390 px 主页/题目页和 320 px 报告页均无横向溢出；标题、选项、分享按钮位于内容边界内。
- 浏览器控制台：无 warning 或 error。

## 未采用的中间文件

`public/assets/ui/paper-texture.png`、`stage-curtain.png`、`stage-curtain-ui.png` 与 `stage-curtain-ui-v2.png` 是生成和抠图过程中的中间版本，CSS 未引用。当前运行环境的删除策略阻止了自动清理；它们不会进入实际页面请求，可在后续人工清理。
