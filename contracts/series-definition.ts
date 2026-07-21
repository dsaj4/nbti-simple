/**
 * Reboot boundary: a series supplies questions and result types, but does not
 * prescribe storage, framework, scoring algorithm, or authoring workflow.
 */
export type SeriesDefinition = {
  id: string;
  version: string;
  title: string;
  questions: Question[];
  resultTypes: ResultType[];
  scoring: ScoringProfile;
};

export type Question = {
  id: string;
  tag: string;
  title: string;
  prompt: string;
  options: QuestionOption[];
};

export type QuestionOption = {
  id: string;
  label: string;
  weights: DimensionWeights;
  action: string;
};

export type DimensionWeights = {
  cognitivePath: WeightValue;
  driveSource: WeightValue;
  cognitiveTempo: WeightValue;
  valueOrientation: WeightValue;
};

export type WeightValue = -1 | 0 | 1;

export type DimensionKey = keyof DimensionWeights;

export type ResultType = {
  id: string;
  code: string;
  label: string;
  shortLabel?: string;
};

export type ScoringProfile = {
  medians: Record<DimensionKey, number>;
  scaleFactor: number;
};
