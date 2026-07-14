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
  prompt: string;
  options: QuestionOption[];
};

export type QuestionOption = {
  id: string;
  label: string;
};

export type ResultType = {
  id: string;
  label: string;
  shortLabel?: string;
};
