import type {
  DimensionKey,
  EvidenceItem,
  ScoreResult,
} from "../../contracts/score-result";
import type { DimensionWeights, Question, SeriesDefinition } from "../../contracts/series-definition";
import { identityByDimension } from "../content/identities";

export const allDimensionKeys: DimensionKey[] = [
  "organization",
  "calibration",
  "momentum",
  "scope",
];

export type DimensionBounds = Record<
  DimensionKey,
  { min: number; max: number }
>;

export type WeakSignalThresholds = {
  minPeak: number;
  minGap: number;
};

export const defaultThresholds: WeakSignalThresholds = {
  // If no dimension reaches this absolute position, treat the signal as weak.
  minPeak: 35,
  // If the top two dimensions are this close (in absolute position), treat the signal as weak.
  minGap: 18,
};

export function computeDimensionBounds(series: SeriesDefinition): DimensionBounds {
  const bounds = Object.fromEntries(
    allDimensionKeys.map((key) => [key, { min: 0, max: 0 }]),
  ) as DimensionBounds;

  for (const question of series.questions) {
    for (const key of allDimensionKeys) {
      const reachableWeights = question.options.map(
        (option) => option.weights[key],
      );
      bounds[key].min += Math.min(0, ...reachableWeights);
      bounds[key].max += Math.max(0, ...reachableWeights);
    }
  }

  return bounds;
}

export function sumWeights(
  series: SeriesDefinition,
  answers: number[],
): Record<DimensionKey, number> {
  const sums = Object.fromEntries(
    allDimensionKeys.map((key) => [key, 0]),
  ) as Record<DimensionKey, number>;

  for (let index = 0; index < answers.length; index += 1) {
    const question = series.questions[index];
    const answerIndex = answers[index];
    if (!question || answerIndex === undefined || answerIndex === null) {
      continue;
    }
    const option = question.options[answerIndex];
    if (!option) {
      continue;
    }
    for (const key of allDimensionKeys) {
      sums[key] += option.weights[key];
    }
  }

  return sums;
}

export function normalizeScores(
  sums: Record<DimensionKey, number>,
  bounds: DimensionBounds,
): Record<DimensionKey, number> {
  const positions = Object.fromEntries(
    allDimensionKeys.map((key) => [key, 0]),
  ) as Record<DimensionKey, number>;

  for (const key of allDimensionKeys) {
    const sum = sums[key];
    const { min, max } = bounds[key];
    if (sum < 0 && min < 0) {
      positions[key] = Math.max(-100, (sum / Math.abs(min)) * 100);
    } else if (sum > 0 && max > 0) {
      positions[key] = Math.min(100, (sum / max) * 100);
    } else {
      positions[key] = 0;
    }
  }

  return positions;
}

export function selectIdentity(
  positions: Record<DimensionKey, number>,
  thresholds: WeakSignalThresholds = defaultThresholds,
): string {
  const entries = allDimensionKeys.map((key) => ({
    key,
    abs: Math.abs(positions[key]),
    sign: Math.sign(positions[key]) as -1 | 0 | 1,
  }));

  const sorted = entries.slice().sort((a, b) => b.abs - a.abs);
  const [first, second] = sorted;

  if (!first || first.abs < thresholds.minPeak) {
    return "multi-path";
  }

  if (second && first.abs - second.abs < thresholds.minGap) {
    return "multi-path";
  }

  const mapping = identityByDimension[first.key];
  return first.sign > 0 ? mapping.positive : mapping.negative;
}

export function positionLabel(value: number): string {
  if (value <= -60) return "明显靠近左端";
  if (value <= -25) return "略靠近左端";
  if (value <= 25) return "两端都在使用";
  if (value <= 60) return "略靠近右端";
  return "明显靠近右端";
}

export function collectEvidence(
  series: SeriesDefinition,
  answers: number[],
  primaryDimension: DimensionKey,
  primarySign: -1 | 1,
): EvidenceItem[] {
  const candidates: EvidenceItem[] = [];

  for (let index = 0; index < answers.length; index += 1) {
    const question = series.questions[index];
    const answerIndex = answers[index];
    if (!question || answerIndex === undefined || answerIndex === null) {
      continue;
    }
    const option = question.options[answerIndex];
    if (!option) {
      continue;
    }

    const weight = option.weights[primaryDimension];
    if (Math.sign(weight) !== primarySign || weight === 0) {
      continue;
    }

    candidates.push({
      questionId: question.id,
      questionTitle: `${question.tag} · ${question.title}`,
      choiceLabel: option.label,
      action: option.action,
      dimensionKey: primaryDimension,
      weight,
    });
  }

  // Sort by absolute weight descending, then stable by question index.
  candidates.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  // Prefer evidence from different tags.
  const selected: EvidenceItem[] = [];
  const usedTags = new Set<string>();

  // First pass: pick the strongest candidate from each tag.
  const byTag = new Map<string, EvidenceItem[]>();
  for (const item of candidates) {
    const tag = item.questionTitle.split(" · ")[0] ?? "";
    const group = byTag.get(tag) ?? [];
    group.push(item);
    byTag.set(tag, group);
  }

  const representatives = Array.from(byTag.values())
    .map((group) => group[0])
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  for (const item of representatives) {
    const tag = item.questionTitle.split(" · ")[0] ?? "";
    usedTags.add(tag);
    selected.push(item);
    if (selected.length >= 3) {
      return selected;
    }
  }

  // Second pass: fill remaining slots with the next strongest candidates,
  // skipping tags already used unless there are not enough unique tags.
  for (const item of candidates) {
    const tag = item.questionTitle.split(" · ")[0] ?? "";
    if (usedTags.has(tag)) {
      continue;
    }
    usedTags.add(tag);
    selected.push(item);
    if (selected.length >= 3) {
      return selected;
    }
  }

  // Final fallback if the pool is too small.
  for (const item of candidates) {
    if (!selected.includes(item) && selected.length < 3) {
      selected.push(item);
    }
  }

  return selected;
}

export function scoreAnswers(
  series: SeriesDefinition,
  answers: number[],
  thresholds: WeakSignalThresholds = defaultThresholds,
): ScoreResult {
  const bounds = computeDimensionBounds(series);
  const sums = sumWeights(series, answers);
  const positions = normalizeScores(sums, bounds);
  const identityId = selectIdentity(positions, thresholds);

  // Determine the primary dimension for evidence selection.
  let primaryDimension: DimensionKey = "organization";
  let primarySign: -1 | 1 = 1;
  if (identityId !== "multi-path") {
    for (const [dimKey, mapping] of Object.entries(identityByDimension)) {
      if (mapping.negative === identityId) {
        primaryDimension = dimKey as DimensionKey;
        primarySign = -1;
        break;
      }
      if (mapping.positive === identityId) {
        primaryDimension = dimKey as DimensionKey;
        primarySign = 1;
        break;
      }
    }
  }

  const evidence =
    identityId === "multi-path"
      ? []
      : collectEvidence(series, answers, primaryDimension, primarySign);

  return {
    seriesId: series.id,
    version: series.version,
    primaryResultId: identityId,
    dimensionScores: sums,
    dimensionPositions: positions,
    evidence,
  };
}

export function optionIndexById(question: Question, optionId: string): number {
  return question.options.findIndex((option) => option.id === optionId);
}

export function getQuestionWeights(question: Question): DimensionWeights[] {
  return question.options.map((option) => option.weights);
}
