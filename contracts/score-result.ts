/** A deterministic answer-to-result boundary. */
export type ScoreResult = {
  seriesId: string;
  version: string;
  primaryResultId: string;
  dimensionScores: Record<DimensionKey, number>;
  dimensionPositions: Record<DimensionKey, number>;
  evidence: EvidenceItem[];
};

export type DimensionKey = "organization" | "calibration" | "momentum" | "scope";

export type EvidenceItem = {
  questionId: string;
  questionTitle: string;
  choiceLabel: string;
  action: string;
  dimensionKey: DimensionKey;
  weight: number;
};
