/** The only data the first report UI should need from its domain layer. */
export type ReportViewModel = {
  identity: ResultIdentity;
  stage: ReportStage;
  dimensions: ReportDimension[];
  rarity?: Rarity;
  safetyNote: string;
};

export type ResultIdentity = {
  code: string;
  label: string;
  subtitle: string;
};

export type ReportStage = {
  headline: string;
  scene: string;
  cameoStates?: CameoState[];
};

export type CameoState = {
  id: string;
  label: string;
  description: string;
};

export type ReportDimension = {
  id: string;
  label: string;
  value: number;
  explanation: string;
};

export type Rarity = {
  label: string;
  percentage?: number;
};
