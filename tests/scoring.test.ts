import { describe, expect, it } from "vitest";
import { nbtiSeries } from "../src/content/series";
import type { SeriesDefinition } from "../contracts/series-definition";
import {
  allDimensionKeys,
  computeDimensionBounds,
  normalizeScores,
  scoreAnswers,
  sumWeights,
} from "../src/domain/scoring";

// Hand-tuned answer sequences that push one dimension to ±100 while keeping
// the others small, guaranteeing the corresponding directional identity.
const identityAnswers: Record<string, number[]> = {
  deconstructor: [0, 1, 0, 1, 2, 0, 0, 0, 0, 1, 0, 0],
  connector: [1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0],
  calibrator: [1, 0, 2, 1, 0, 0, 3, 0, 0, 0, 2, 0],
  "context-reader": [0, 1, 3, 0, 1, 1, 2, 1, 1, 1, 3, 1],
  anchor: [1, 3, 0, 0, 1, 3, 3, 2, 0, 3, 3, 0],
  explorer: [0, 2, 1, 1, 0, 2, 1, 3, 0, 2, 2, 1],
  overlooker: [2, 1, 1, 2, 2, 2, 2, 0, 2, 2, 3, 2],
  present: [3, 0, 0, 3, 3, 3, 3, 1, 3, 3, 1, 3],
};

// A near-neutral answer sequence designed to keep every dimension close to zero.
const weakSignalAnswers = [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1];

describe("scoring", () => {
  it("is deterministic for the same answers", () => {
    const answers = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
    const first = scoreAnswers(nbtiSeries, answers);
    const second = scoreAnswers(nbtiSeries, answers);
    expect(first.primaryResultId).toBe(second.primaryResultId);
    expect(first.dimensionPositions).toEqual(second.dimensionPositions);
    expect(first.evidence).toEqual(second.evidence);
  });

  it("reaches all eight directional identities", () => {
    for (const [identityId, answers] of Object.entries(identityAnswers)) {
      const result = scoreAnswers(nbtiSeries, answers);
      expect(result.primaryResultId).toBe(identityId);

      const maxPosition = Math.max(
        ...allDimensionKeys.map((key) =>
          Math.abs(result.dimensionPositions[key]),
        ),
      );
      expect(maxPosition).toBe(100);
    }
  });

  it("reaches the weak-signal fallback identity", () => {
    const result = scoreAnswers(nbtiSeries, weakSignalAnswers);
    const maxPosition = Math.max(
      ...allDimensionKeys.map((key) =>
        Math.abs(result.dimensionPositions[key]),
      ),
    );
    expect(maxPosition).toBeLessThan(35);
    expect(result.primaryResultId).toBe("multi-path");
  });

  it("normalizes negative and positive sides independently", () => {
    const bounds = computeDimensionBounds(nbtiSeries);
    const negativeSums = Object.fromEntries(
      allDimensionKeys.map((key) => [key, bounds[key].min]),
    ) as Record<(typeof allDimensionKeys)[number], number>;
    const positiveSums = Object.fromEntries(
      allDimensionKeys.map((key) => [key, bounds[key].max]),
    ) as Record<(typeof allDimensionKeys)[number], number>;

    expect(normalizeScores(negativeSums, bounds)).toEqual(
      Object.fromEntries(allDimensionKeys.map((key) => [key, -100])),
    );
    expect(normalizeScores(positiveSums, bounds)).toEqual(
      Object.fromEntries(allDimensionKeys.map((key) => [key, 100])),
    );
  });

  it("computes bounds from one reachable option per question", () => {
    const series: SeriesDefinition = {
      ...nbtiSeries,
      questions: [
        {
          ...nbtiSeries.questions[0],
          options: nbtiSeries.questions[0].options.map((option, index) => ({
            ...option,
            weights: {
              ...option.weights,
              organization: [-2, -1, 1, 2][index] as -2 | -1 | 1 | 2,
            },
          })),
        },
      ],
    };

    expect(computeDimensionBounds(series).organization).toEqual({
      min: -2,
      max: 2,
    });
  });

  it("caps extreme sums at -100 and 100", () => {
    const bounds = computeDimensionBounds(nbtiSeries);
    const exaggerated = Object.fromEntries(
      allDimensionKeys.map((key) => [key, bounds[key].min * 2]),
    ) as Record<(typeof allDimensionKeys)[number], number>;
    const positions = normalizeScores(exaggerated, bounds);
    for (const key of allDimensionKeys) {
      expect(positions[key]).toBe(-100);
    }
  });

  it("selects evidence with the same sign as the primary direction", () => {
    const result = scoreAnswers(nbtiSeries, identityAnswers.explorer);
    expect(result.evidence.length).toBeGreaterThanOrEqual(3);
    for (const item of result.evidence) {
      expect(item.dimensionKey).toBe("momentum");
      expect(Math.sign(item.weight)).toBe(1);
    }
  });

  it("selects evidence from different question tags when possible", () => {
    const result = scoreAnswers(nbtiSeries, identityAnswers.overlooker);
    const tags = result.evidence.map((item) =>
      item.questionTitle.split(" · ")[0],
    );
    expect(new Set(tags).size).toBeGreaterThanOrEqual(
      Math.min(3, result.evidence.length),
    );
  });

  it("sums weights correctly", () => {
    const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sums = sumWeights(nbtiSeries, answers);
    expect(Object.values(sums).some((value) => value !== 0)).toBe(true);
  });
});
