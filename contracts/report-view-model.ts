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
  englishLabel?: string;
};

export type ReportStage = {
  headline: string;
  scene: string;
  cameoStates?: CameoState[];
  capabilityHighlights?: StageCapabilityHighlight[];
};

export type CameoState = {
  id: string;
  label: string;
  eyebrow?: string;
  description: string;
  visual?: ReportImageAsset;
};

export type ReportImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  variant?: string;
};

export type StageCapabilityHighlight = {
  dimensionId: string;
  title: string;
};

export type ReportDimension = {
  id: string;
  label: string;
  shortCode?: string;
  value: number;
  explanation: string;
};

export type Rarity = {
  label: string;
  percentage?: number;
};
