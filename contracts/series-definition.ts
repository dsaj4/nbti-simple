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
  organization: WeightValue;
  calibration: WeightValue;
  momentum: WeightValue;
  scope: WeightValue;
};

export type WeightValue = -2 | -1 | 0 | 1 | 2;

export type DimensionKey = keyof DimensionWeights;

export type ResultType = {
  id: string;
  label: string;
  shortLabel?: string;
};
