import type {
  DimensionKey,
  DimensionWeights,
  ResultType,
} from "./series-definition";

export type QuestionnaireDocument = {
  $schema?: string;
  schemaVersion: "1.0.0";
  kind: "nbti.questionnaire";
  id: string;
  version: string;
  contentDigest: string;
  locale: string;
  title: string;
  questionCount: number;
  safety: QuestionnaireSafety;
  dimensions: QuestionnaireDimension[];
  questions: QuestionnaireQuestion[];
  resultTypes: ResultType[];
};

export type QuestionnaireSafety = {
  notDiagnosis: true;
  notPersonalityAssessment: true;
  notAbilityRating: true;
  statement: string;
};

export type QuestionnaireDimension = {
  id: DimensionKey;
  label: string;
  left: QuestionnaireEndpoint;
  right: QuestionnaireEndpoint;
  explanation: string;
};

export type QuestionnaireEndpoint = {
  id: string;
  label: string;
};

export type QuestionnaireQuestion = {
  id: string;
  order: number;
  tag: string;
  title: string;
  prompt: string;
  options: QuestionnaireOption[];
};

export type QuestionnaireOption = {
  id: string;
  label: string;
  action: string;
  weights: DimensionWeights;
};
