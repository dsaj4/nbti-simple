export type AgentAnswerRequest = {
  $schema?: string;
  protocolVersion: "1.0.0";
  kind: "nbti.agent-answer.request";
  requestId: string;
  seriesRef: AgentSeriesRef;
  mode: "single" | "full-batch";
  task: "choose-one-option-per-question";
  responseOptions: {
    rationale: "omit" | "optional";
    selectionConfidence: "omit" | "optional";
  };
  constraints: {
    chooseExactlyOne: true;
    scoringMetadataIncluded: false;
    doNotDiagnose: true;
    doNotAssessPersonality: true;
    doNotRateAbility: true;
    rationaleLimitedToCurrentSituation: true;
  };
  questions: AgentQuestion[];
};

export type AgentSeriesRef = {
  id: string;
  version: string;
  contentDigest: string;
};

export type AgentQuestion = {
  id: string;
  tag: string;
  prompt: string;
  options: Array<{ id: string; label: string }>;
};

export type AgentAnswer = {
  questionId: string;
  optionId: string;
  rationale?: string;
  selectionConfidence?: number;
};

export type AgentAnswerOkResponse = {
  $schema?: string;
  protocolVersion: "1.0.0";
  kind: "nbti.agent-answer.response";
  requestId: string;
  status: "ok";
  seriesRef: AgentSeriesRef;
  answers: AgentAnswer[];
  agent?: {
    id: string;
    provider?: string;
    model?: string;
  };
};

export type AgentAnswerErrorCode =
  | "INVALID_JSON"
  | "SCHEMA_VALIDATION_FAILED"
  | "UNSUPPORTED_PROTOCOL_VERSION"
  | "SERIES_NOT_FOUND"
  | "SERIES_VERSION_MISMATCH"
  | "SERIES_DIGEST_MISMATCH"
  | "QUESTION_SET_MISMATCH"
  | "UNKNOWN_QUESTION_ID"
  | "UNKNOWN_OPTION_ID"
  | "DUPLICATE_ANSWER"
  | "MISSING_ANSWER"
  | "OUTPUT_POLICY_VIOLATION"
  | "PRIVACY_POLICY_VIOLATION"
  | "INVALID_AGENT_OUTPUT"
  | "AGENT_REFUSED"
  | "AGENT_UNAVAILABLE"
  | "INTERNAL_ERROR";

export type AgentAnswerErrorResponse = {
  $schema?: string;
  protocolVersion: "1.0.0";
  kind: "nbti.agent-answer.response";
  requestId: string;
  status: "error";
  seriesRef: AgentSeriesRef;
  error: {
    code: AgentAnswerErrorCode;
    message: string;
    retryable: boolean;
    issues: Array<{ path: string; code: string }>;
  };
};

export type AgentAnswerResponse =
  | AgentAnswerOkResponse
  | AgentAnswerErrorResponse;
