import type { DimensionKey, EvidenceItem, PreferenceClarity, ScoreResult } from "../../contracts/score-result";
import type { DimensionWeights, Question, SeriesDefinition } from "../../contracts/series-definition";
import { identityIdByTypeCode, validTypeCodes } from "../content/identities";

export const allDimensionKeys: DimensionKey[] = [
  "cognitivePath", "driveSource", "cognitiveTempo", "valueOrientation",
];

const positiveLetters: Record<DimensionKey, string> = {
  cognitivePath: "D",
  driveSource: "L",
  cognitiveTempo: "R",
  valueOrientation: "P",
};
const negativeLetters: Record<DimensionKey, string> = {
  cognitivePath: "C",
  driveSource: "N",
  cognitiveTempo: "A",
  valueOrientation: "H",
};

export type DimensionBounds = Record<DimensionKey, { min: number; max: number }>;

export function computeDimensionBounds(series: SeriesDefinition): DimensionBounds {
  return Object.fromEntries(allDimensionKeys.map((key) => {
    const min = series.questions.reduce((sum, question) => sum + Math.min(0, ...question.options.map((option) => option.weights[key])), 0);
    const max = series.questions.reduce((sum, question) => sum + Math.max(0, ...question.options.map((option) => option.weights[key])), 0);
    return [key, { min, max }];
  })) as DimensionBounds;
}

export function sumWeights(series: SeriesDefinition, answers: number[]): Record<DimensionKey, number> {
  const sums = Object.fromEntries(allDimensionKeys.map((key) => [key, 0])) as Record<DimensionKey, number>;
  answers.forEach((answerIndex, index) => {
    const option = series.questions[index]?.options[answerIndex];
    if (!option) return;
    for (const key of allDimensionKeys) sums[key] += option.weights[key];
  });
  return sums;
}

export function centerScores(series: SeriesDefinition, sums: Record<DimensionKey, number>): Record<DimensionKey, number> {
  return Object.fromEntries(allDimensionKeys.map((key) => [key, sums[key] - series.scoring.medians[key]])) as Record<DimensionKey, number>;
}

export function normalizeScores(centered: Record<DimensionKey, number>, scaleFactor: number): Record<DimensionKey, number> {
  return Object.fromEntries(allDimensionKeys.map((key) => [key, Math.max(-100, Math.min(100, (centered[key] / scaleFactor) * 100))])) as Record<DimensionKey, number>;
}

export function clarityForScore(centeredScore: number): PreferenceClarity {
  const absolute = Math.abs(centeredScore);
  if (absolute >= 6) return "very-clear";
  if (absolute >= 3) return "clear";
  return "borderline";
}

export function rawTypeCodeForScores(centered: Record<DimensionKey, number>): string {
  return allDimensionKeys.map((key) => centered[key] > 0 ? positiveLetters[key] : negativeLetters[key]).join("");
}

export function resolveTypeCode(centered: Record<DimensionKey, number>): { rawTypeCode: string; typeCode: string } {
  const rawTypeCode = rawTypeCodeForScores(centered);
  if (validTypeCodes.includes(rawTypeCode as (typeof validTypeCodes)[number])) return { rawTypeCode, typeCode: rawTypeCode };
  const rankedDimensions = allDimensionKeys.map((key, index) => ({ key, index, clarity: Math.abs(centered[key]) })).sort((a, b) => a.clarity - b.clarity || a.index - b.index);
  const candidate = rawTypeCode.split("");
  for (const dimension of rankedDimensions) {
    const index = dimension.index;
    candidate[index] = candidate[index] === positiveLetters[dimension.key] ? negativeLetters[dimension.key] : positiveLetters[dimension.key];
    const code = candidate.join("");
    if (validTypeCodes.includes(code as (typeof validTypeCodes)[number])) return { rawTypeCode, typeCode: code };
  }
  throw new Error(`Unable to resolve unsupported NBTI type ${rawTypeCode}`);
}

export function collectEvidence(series: SeriesDefinition, answers: number[], centered: Record<DimensionKey, number>): EvidenceItem[] {
  const candidates: EvidenceItem[] = [];
  answers.forEach((answerIndex, index) => {
    const question = series.questions[index];
    const option = question?.options[answerIndex];
    if (!question || !option) return;
    const matching = allDimensionKeys.filter((key) => option.weights[key] !== 0 && Math.sign(option.weights[key]) === Math.sign(centered[key]));
    if (matching.length === 0) return;
    const dimensionKey = matching.sort((a, b) => Math.abs(centered[b]) - Math.abs(centered[a]))[0];
    candidates.push({ questionId: question.id, questionTitle: `${question.tag} · ${question.title}`, choiceLabel: option.label, action: option.action, dimensionKey, weight: option.weights[dimensionKey] });
  });
  const selected: EvidenceItem[] = [];
  const tags = new Set<string>();
  for (const item of candidates.sort((a, b) => Math.abs(centered[b.dimensionKey]) - Math.abs(centered[a.dimensionKey]))) {
    const tag = item.questionTitle.split(" · ")[0];
    if (!tags.has(tag)) { selected.push(item); tags.add(tag); }
    if (selected.length === 3) break;
  }
  return selected.length === 3 ? selected : [...selected, ...candidates.filter((item) => !selected.includes(item))].slice(0, 3);
}

export function scoreAnswers(series: SeriesDefinition, answers: number[]): ScoreResult {
  const dimensionScores = sumWeights(series, answers);
  const centeredScores = centerScores(series, dimensionScores);
  const dimensionPositions = normalizeScores(centeredScores, series.scoring.scaleFactor);
  const { rawTypeCode, typeCode } = resolveTypeCode(centeredScores);
  return {
    seriesId: series.id,
    version: series.version,
    primaryResultId: identityIdByTypeCode[typeCode],
    rawTypeCode,
    typeCode,
    dimensionScores,
    centeredScores,
    dimensionPositions,
    preferenceClarity: Object.fromEntries(allDimensionKeys.map((key) => [key, clarityForScore(centeredScores[key])])) as Record<DimensionKey, PreferenceClarity>,
    evidence: collectEvidence(series, answers, centeredScores),
  };
}

export function optionIndexById(question: Question, optionId: string): number { return question.options.findIndex((option) => option.id === optionId); }
export function getQuestionWeights(question: Question): DimensionWeights[] { return question.options.map((option) => option.weights); }
