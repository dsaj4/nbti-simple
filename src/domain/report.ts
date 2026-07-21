import type { ReportViewModel } from "../../contracts/report-view-model";
import type { DimensionKey } from "../../contracts/score-result";
import type { SeriesDefinition } from "../../contracts/series-definition";
import {
  dimensionExplanations,
  dimensionLabels,
} from "../content/series";
import { identityMap } from "../content/identities";
import { reportRoleForIdentity } from "../content/reportRoles";
import { allDimensionKeys, scoreAnswers } from "./scoring";

export const safetyNote =
  "NBTI 是趣味性的思维风格表达，不是心理诊断，也不评定人格或能力。结果只描述你在这组情境中的判断方式。";

export const sampleLimitation =
  "只描述你在本组情境中的判断方式";

export function buildReportViewModel(
  series: SeriesDefinition,
  answers: number[],
): ReportViewModel {
  const score = scoreAnswers(series, answers);
  const identity = identityMap[score.primaryResultId] ?? identityMap["multi-path"];
  const role = reportRoleForIdentity(
    score.primaryResultId,
    score.dimensionPositions,
  );

  const dimensions = allDimensionKeys.map((key) => {
    const value = score.dimensionPositions[key];
    const labels = dimensionLabels[key];
    return {
      id: key,
      label: `${labels.left}—${labels.right}`,
      shortCode: labels.left.slice(0, 1),
      leftLabel: labels.left,
      rightLabel: labels.right,
      value,
      positionLabel: getPositionLabel(value),
      explanation: dimensionExplanations[key],
      clarity: score.preferenceClarity[key],
      clarityLabel: clarityLabel(score.preferenceClarity[key]),
    };
  });

  return {
    identity: {
      code: identity.code,
      label: identity.label,
      subtitle: identity.subtitle,
      englishLabel: identity.englishLabel,
    },
    role: {
      id: role.id,
      label: role.label,
      englishLabel: role.englishLabel,
      subtitle: role.subtitle,
      headline: role.headline,
      scene: role.scene,
      actions: role.actions.length > 0 ? role.actions : identity.actions,
      ...(role.assetSrc ? { assetSrc: role.assetSrc } : {}),
    },
    stage: {
      headline: role.headline,
      scene: role.scene,
    },
    dimensions,
    hasBoundaryState: dimensions.some((dimension) => dimension.clarity === "borderline"),
    actions: role.actions.length > 0 ? role.actions : identity.actions,
    evidence: score.evidence.map((item) => ({
      questionTitle: item.questionTitle,
      choice: item.choiceLabel,
      action: item.action,
    })),
    safetyNote,
    sampleLimitation,
  };
}

function clarityLabel(clarity: "very-clear" | "clear" | "borderline"): string {
  if (clarity === "very-clear") return "非常清晰";
  if (clarity === "clear") return "清晰";
  return "边界状态";
}

export function getPositionLabel(value: number): string {
  if (value <= -60) return "明显靠近左端";
  if (value <= -25) return "略靠近左端";
  if (value <= 25) return "两端都在使用";
  if (value <= 60) return "略靠近右端";
  return "明显靠近右端";
}

export function describeDimensionValue(
  key: DimensionKey,
  value: number,
): string {
  const labels = dimensionLabels[key];
  const side = value > 25 ? labels.right : value < -25 ? labels.left : null;
  if (side === null) {
    return `在${labels.left}与${labels.right}之间保持开放`;
  }
  return `更常先使用${side}策略`;
}
