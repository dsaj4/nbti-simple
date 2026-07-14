/** A deterministic answer-to-result boundary. The algorithm remains open. */
export type ScoreResult = {
  seriesId: string;
  primaryResultId: string;
  dimensionScores: Record<string, number>;
  confidence?: number;
  explanationKeys: string[];
};
