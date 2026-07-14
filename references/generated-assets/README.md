# Generated Asset Sources

这里保存 Editorial Stage 复杂视觉素材的生成源、参考裁图和提示词元数据。它们用于审计和重新处理，不会由 Vite 发布。

运行时仅使用：

- `public/assets/judge.png`
- `public/assets/curtains.png`
- `public/assets/philosopher.webp`

哲学家运行时素材由 `philosopher-source.png` 通过项目级 `draw-ui` 脚本生成：

```powershell
python .codex\skills\draw-ui\scripts\prepare_image_asset.py `
  references\generated-assets\philosopher-source.png `
  public\assets\philosopher.webp `
  --key-color '#00ff00' `
  --key-threshold 62 `
  --feather 54 `
  --despill `
  --edge-contract 1 `
  --padding 10
```

不要把本目录整体复制回 `public/`；Vite 会原样发布 `public/` 下的所有文件。
