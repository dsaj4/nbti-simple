import type { ReportViewModel } from "../../../contracts/report-view-model";
import reportFixture from "../../../fixtures/minimal-report-case.json";

export const reportData = reportFixture satisfies ReportViewModel;

export function assertReportIsComplete(report: ReportViewModel): ReportViewModel {
  if (!report.identity.code || !report.identity.label || !report.stage.headline) {
    throw new Error("报告身份或舞台信息不完整");
  }

  if (report.identity.englishLabel !== undefined && !report.identity.englishLabel.trim()) {
    throw new Error("报告英文身份名称不能为空");
  }

  if (report.dimensions.length !== 4) {
    throw new Error("首版报告必须包含四个思维维度");
  }

  const dimensionIds = new Set<string>();
  for (const dimension of report.dimensions) {
    if (dimensionIds.has(dimension.id)) {
      throw new Error(`维度 ${dimension.id} 重复`);
    }
    dimensionIds.add(dimension.id);

    if (dimension.value < 0 || dimension.value > 100) {
      throw new Error(`维度 ${dimension.id} 的数值超出 0–100`);
    }

    if (dimension.shortCode !== undefined && !dimension.shortCode.trim()) {
      throw new Error(`维度 ${dimension.id} 的缩写不能为空`);
    }
  }

  const cameoIds = new Set<string>();
  for (const cameo of report.stage.cameoStates ?? []) {
    if (cameoIds.has(cameo.id)) {
      throw new Error(`舞台状态 ${cameo.id} 重复`);
    }
    cameoIds.add(cameo.id);

    if (cameo.eyebrow !== undefined && !cameo.eyebrow.trim()) {
      throw new Error(`舞台状态 ${cameo.id} 的眉题不能为空`);
    }

    if (
      cameo.visual &&
      (!cameo.visual.src.trim() ||
        !cameo.visual.alt.trim() ||
        cameo.visual.width <= 0 ||
        cameo.visual.height <= 0 ||
        (cameo.visual.variant !== undefined &&
          cameo.visual.variant !== "primary" &&
          cameo.visual.variant !== "supporting"))
    ) {
      throw new Error(`舞台状态 ${cameo.id} 的视觉素材不完整`);
    }
  }

  const highlightedDimensions = new Set<string>();
  for (const highlight of report.stage.capabilityHighlights ?? []) {
    if (!dimensionIds.has(highlight.dimensionId)) {
      throw new Error(`能力摘要引用了不存在的维度 ${highlight.dimensionId}`);
    }
    if (highlightedDimensions.has(highlight.dimensionId)) {
      throw new Error(`能力摘要重复引用维度 ${highlight.dimensionId}`);
    }
    if (!highlight.title.trim()) {
      throw new Error(`维度 ${highlight.dimensionId} 的能力标题不能为空`);
    }
    highlightedDimensions.add(highlight.dimensionId);
  }

  if (!report.safetyNote) {
    throw new Error("报告必须包含边界提示");
  }

  return report;
}
