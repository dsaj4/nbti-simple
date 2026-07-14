# Editorial Stage Design QA

- Source visual truth: `E:\Project\nbti-reboot\references\report-design\editorial-stage-primary.png`
- Desktop implementation screenshot: `E:\Project\nbti-reboot\work\qa\desktop-1586x992-final.png`
- Mobile implementation screenshots: `E:\Project\nbti-reboot\work\qa\mobile-390x844-final.png`, `E:\Project\nbti-reboot\work\qa\mobile-panel-390.png`, `E:\Project\nbti-reboot\work\qa\mobile-share-390.png`
- Full-view comparison: `E:\Project\nbti-reboot\work\qa\comparison-full.png`
- Focused comparisons: `E:\Project\nbti-reboot\work\qa\comparison-stage.png`, `E:\Project\nbti-reboot\work\qa\comparison-panel.png`
- Desktop viewport/state: 1586 × 992, default 本尊幕
- Mobile viewport/state: 390 × 844, default 本尊幕 with separate panel/share captures

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: Noto Serif SC variable font plus Georgia reproduce the Chinese editorial hierarchy and English display contrast. The implementation title is slightly more compact than the mock, classified as P3 because hierarchy and wrapping remain equivalent.
- Spacing and layout: desktop preserves the approximately 2.1:1 stage-to-panel grid and fits the complete report in the 1586 × 992 viewport. Mobile becomes a readable single column with a 362 px content track and no horizontal document overflow.
- Colors and tokens: warm paper, mature red, restrained gold, teal metrics, fine tan borders, and soft elevation match the source direction.
- Image quality: the judge and curtains are independent transparent generated PNG assets with validated alpha and no visible green fringe. The philosopher is now a dedicated 946 × 1908 transparent WebP derived from the saved 2048 × 2048 source; desktop and mobile checks show clean edges and no green spill.
- Copy and content: all primary report text comes from the structured fixture. The shorter copy preserves the source hierarchy while complying with non-diagnostic and non-endorsement boundaries.
- Icons: Phosphor icons provide a consistent production icon family; no emoji, placeholder icons, or hand-drawn SVG substitutes remain.
- Accessibility and behavior: semantic headings, meters, tab roles, keyboard arrow navigation, alt text, focus-visible styles, reduced-motion handling, and live share feedback are present.

## Comparison History

1. Desktop v1 found two P2 differences: the full-body judge rendered too small and dimension initials used Chinese characters. Fixed by using a deliberate upper-body crop and mapping dimensions to D/L/A/H.
2. Desktop v2 found a P2 overlap between the character caption chip and the capability card. Removed the redundant chip; the same description remains in the selected ticket and tabpanel.
3. Mobile pass found no horizontal overflow or clipped primary content. Full-page stitching was unreliable in the in-app browser, so the pass uses DOM geometry plus separate viewport captures for the stage, panel, and share region.
4. Share interaction initially failed when browser permissions denied native sharing and clipboard writes. Added progressive fallback: native share → Clipboard API → selection copy → selectable report-link field. Unit tests cover each path; the restricted-browser field is visible and keyboard-selectable.
5. The third stage capability was labeled “衡量人文” while rendering the agility explanation. Added explicit capability-to-dimension data so it now renders the humanity explanation.
6. Selecting 追问幕 changed its eyebrow from “转场” to “本尊”. Moved the eyebrow into fixture data so selection only changes visual state, not identity copy.

## Interaction Evidence

- Stage tabs: clicking 追问幕 sets it selected and swaps the main image to the philosopher state; ArrowLeft / ArrowRight also move selection and focus.
- Share: browser-supported native share/copy is attempted first; restricted environments reveal a labeled, read-only report-link field.
- Console: no app warnings or errors were present in the mobile stage, panel, and share captures. A Statsig network timeout came from the browser-control runtime, not the page.
- Automated checks: 13 Vitest tests pass; TypeScript and Vite production build pass.
- Fresh browser pass: 1586 × 992 desktop and 390 × 844 mobile render without page errors or horizontal overflow. Current evidence is under `work/qa/current-*`.
- Production assets: `dist/assets` contains only `judge.png`, `curtains.png`, and `philosopher.webp`; source-generation files remain under `references/generated-assets/`.

## Follow-up Polish

- P3: optionally tune the desktop Chinese display title width closer to the reference after choosing a final brand typeface.

final result: passed
