import { describe, expect, it } from "vitest";
import type { DimensionKey } from "../contracts/score-result";
import { nbtiSeries } from "../src/content/series";
import { allDimensionKeys, centerScores, clarityForScore, computeDimensionBounds, resolveTypeCode, scoreAnswers, sumWeights } from "../src/domain/scoring";

describe("NBTI v2 scoring", () => {
  it("uses the 24-question multi-polarity matrix", () => {
    expect(nbtiSeries.questions).toHaveLength(24);
    for (const question of nbtiSeries.questions) {
      for (const option of question.options) {
        const nonZero = Object.values(option.weights).filter(Boolean);
        expect(nonZero.length).toBeGreaterThanOrEqual(2);
        expect(nonZero.length).toBeLessThanOrEqual(3);
      }
    }
    expect(computeDimensionBounds(nbtiSeries)).toEqual({
      cognitivePath: { min: -24, max: 24 },
      driveSource: { min: -24, max: 24 },
      cognitiveTempo: { min: -24, max: 24 },
      valueOrientation: { min: -24, max: 24 },
    });
  });

  it("subtracts the frozen cold-start medians", () => {
    const raw = { cognitivePath: 6, driveSource: 5, cognitiveTempo: 4, valueOrientation: 7 };
    expect(centerScores(nbtiSeries, raw)).toEqual({ cognitivePath: 4, driveSource: 5, cognitiveTempo: 1, valueOrientation: 6 });
  });

  it("assigns PCI levels at the documented cutoffs", () => {
    expect(clarityForScore(6)).toBe("very-clear");
    expect(clarityForScore(-3)).toBe("clear");
    expect(clarityForScore(2)).toBe("borderline");
    expect(clarityForScore(0)).toBe("borderline");
  });

  it("builds a four-letter type from centered scores", () => {
    const centered: Record<DimensionKey, number> = { cognitivePath: 4, driveSource: 5, cognitiveTempo: 1, valueOrientation: 6 };
    expect(resolveTypeCode(centered)).toEqual({ rawTypeCode: "DLRP", typeCode: "DLRP" });
  });

  it("folds a removed type by flipping its least-clear dimension", () => {
    const centered: Record<DimensionKey, number> = { cognitivePath: -7, driveSource: 1, cognitiveTempo: 5, valueOrientation: 8 };
    expect(resolveTypeCode(centered)).toEqual({ rawTypeCode: "CLRP", typeCode: "CNRP" });
  });

  it("is deterministic and returns one of twelve result types", () => {
    const answers = Array.from({ length: 24 }, (_, index) => index % 4);
    const first = scoreAnswers(nbtiSeries, answers);
    const second = scoreAnswers(nbtiSeries, answers);
    expect(first).toEqual(second);
    expect(nbtiSeries.resultTypes.map((result) => result.id)).toContain(first.primaryResultId);
    expect(first.typeCode).toHaveLength(4);
    expect(first.evidence.length).toBeLessThanOrEqual(3);
  });

  it("sums all mapped dimensions for each selected option", () => {
    const answers = Array(24).fill(0);
    const expected = Object.fromEntries(allDimensionKeys.map((key) => [key, nbtiSeries.questions.reduce((sum, question) => sum + question.options[0].weights[key], 0)]));
    expect(sumWeights(nbtiSeries, answers)).toEqual(expected);
  });
});
