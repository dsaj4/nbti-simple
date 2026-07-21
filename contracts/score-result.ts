/** A deterministic answer-to-result boundary. */
export type ScoreResult = {
  seriesId: string;
  version: string;
  primaryResultId: string;
  rawTypeCode: string;
  typeCode: string;
  dimensionScores: Record<DimensionKey, number>;
  centeredScores: Record<DimensionKey, number>;
  dimensionPositions: Record<DimensionKey, number>;
  preferenceClarity: Record<DimensionKey, PreferenceClarity>;
  evidence: EvidenceItem[];
};

export type DimensionKey =
  | "cognitivePath"
  | "driveSource"
  | "cognitiveTempo"
  | "valueOrientation";

export type PreferenceClarity = "very-clear" | "clear" | "borderline";

export type EvidenceItem = {
  questionId: string;
  questionTitle: string;
  choiceLabel: string;
  action: string;
  dimensionKey: DimensionKey;
  weight: number;
};
