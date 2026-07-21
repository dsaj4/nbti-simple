/** The only data the first report UI should need from its domain layer. */
export type ReportViewModel = {
  identity: ResultIdentity;
  role: ReportRole;
  stage: ReportStage;
  dimensions: ReportDimension[];
  hasBoundaryState: boolean;
  actions: ReportAction[];
  evidence: ReportEvidence[];
  safetyNote: string;
  sampleLimitation: string;
};

export type ReportRole = {
  id: string;
  label: string;
  englishLabel: string;
  subtitle: string;
  headline: string;
  scene: string;
  actions: ReportAction[];
  assetSrc?: string;
};

export type ResultIdentity = {
  code: string;
  label: string;
  subtitle: string;
  englishLabel?: string;
};

export type ReportStage = {
  headline: string;
  scene: string;
};

export type ReportDimension = {
  id: string;
  label: string;
  shortCode?: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  positionLabel: string;
  explanation: string;
  clarity: "very-clear" | "clear" | "borderline";
  clarityLabel: string;
};

export type ReportAction = {
  title: string;
  description: string;
};

export type ReportEvidence = {
  questionTitle: string;
  choice: string;
  action: string;
};
