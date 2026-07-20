import type {
  AgentAnswer,
  AgentAnswerErrorCode,
  AgentAnswerErrorResponse,
  AgentAnswerOkResponse,
  AgentAnswerRequest,
  AgentAnswerResponse,
  AgentSeriesRef,
} from "../../../contracts/agent-answer";
import type { SeriesDefinition } from "../../../contracts/series-definition";
import {
  parseQuestionnaireDocument,
  type ValidatedQuestionnaireDocument,
} from "../../content/questionnaire";
import { optionIndexById } from "../../domain/scoring";

const requestIdPattern = /^req-[A-Za-z0-9_-]{4,120}$/;
const digestPattern = /^sha256:[0-9a-f]{64}$/;
const errorCodes = new Set<AgentAnswerErrorCode>([
  "INVALID_JSON",
  "SCHEMA_VALIDATION_FAILED",
  "UNSUPPORTED_PROTOCOL_VERSION",
  "SERIES_NOT_FOUND",
  "SERIES_VERSION_MISMATCH",
  "SERIES_DIGEST_MISMATCH",
  "QUESTION_SET_MISMATCH",
  "UNKNOWN_QUESTION_ID",
  "UNKNOWN_OPTION_ID",
  "DUPLICATE_ANSWER",
  "MISSING_ANSWER",
  "OUTPUT_POLICY_VIOLATION",
  "PRIVACY_POLICY_VIOLATION",
  "INVALID_AGENT_OUTPUT",
  "AGENT_REFUSED",
  "AGENT_UNAVAILABLE",
  "INTERNAL_ERROR",
]);

declare const validatedAgentAnswerResponseBrand: unique symbol;

export type ValidatedAgentAnswerResponse = AgentAnswerResponse & {
  readonly [validatedAgentAnswerResponseBrand]: true;
};

export type BuildAgentAnswerRequestOptions = {
  requestId: string;
  mode: "single" | "full-batch";
  questionId?: string;
  rationale?: "omit" | "optional";
  selectionConfidence?: "omit" | "optional";
};

export class AgentAnswerProtocolError extends Error {
  constructor(
    readonly code: AgentAnswerErrorCode,
    readonly path: string,
    message: string,
  ) {
    super(`${path}: ${message}`);
    this.name = "AgentAnswerProtocolError";
  }
}

export function createAgentRequestId(): string {
  return `req-${crypto.randomUUID()}`;
}

export function buildAgentAnswerRequest(
  questionnaire: ValidatedQuestionnaireDocument,
  options: BuildAgentAnswerRequestOptions,
): AgentAnswerRequest {
  const canonicalQuestionnaire = parseQuestionnaireDocument(
    questionnaire,
  ).document;
  if (!requestIdPattern.test(options.requestId)) {
    fail("INVALID_AGENT_OUTPUT", "/requestId", "invalid request ID");
  }
  if (options.mode !== "single" && options.mode !== "full-batch") {
    fail("QUESTION_SET_MISMATCH", "/mode", "unsupported request mode");
  }

  let sourceQuestions = canonicalQuestionnaire.questions;
  if (options.mode === "single") {
    if (!options.questionId) {
      fail(
        "QUESTION_SET_MISMATCH",
        "/questionId",
        "single mode requires questionId",
      );
    }
    const question = canonicalQuestionnaire.questions.find(
      (candidate) => candidate.id === options.questionId,
    );
    if (!question) {
      fail(
        "UNKNOWN_QUESTION_ID",
        "/questionId",
        `unknown question ${options.questionId}`,
      );
    }
    sourceQuestions = [question];
  } else if (options.questionId !== undefined) {
    fail(
      "QUESTION_SET_MISMATCH",
      "/questionId",
      "full-batch mode must not select a single question",
    );
  }

  return {
    protocolVersion: "1.0.0",
    kind: "nbti.agent-answer.request",
    requestId: options.requestId,
    seriesRef: seriesRefFromQuestionnaire(canonicalQuestionnaire),
    mode: options.mode,
    task: "choose-one-option-per-question",
    responseOptions: {
      rationale: options.rationale ?? "omit",
      selectionConfidence: options.selectionConfidence ?? "omit",
    },
    constraints: {
      chooseExactlyOne: true,
      scoringMetadataIncluded: false,
      doNotDiagnose: true,
      doNotAssessPersonality: true,
      doNotRateAbility: true,
      rationaleLimitedToCurrentSituation: true,
    },
    questions: sourceQuestions.map((question) => ({
      id: question.id,
      tag: question.tag,
      prompt: question.prompt,
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label,
      })),
    })),
  };
}

export function parseAgentAnswerResponse(
  input: unknown,
  request: AgentAnswerRequest,
): ValidatedAgentAnswerResponse {
  const root = requireRecord(input, "/");
  if (root.$schema !== undefined) {
    requireString(root.$schema, "/$schema");
  }
  requireLiteral(root.protocolVersion, "1.0.0", "/protocolVersion");
  requireLiteral(
    root.kind,
    "nbti.agent-answer.response",
    "/kind",
  );
  const requestId = requireString(root.requestId, "/requestId");
  if (requestId !== request.requestId) {
    fail("INVALID_AGENT_OUTPUT", "/requestId", "does not match request");
  }
  const seriesRef = parseSeriesRef(root.seriesRef, "/seriesRef");
  assertSeriesRefMatches(seriesRef, request.seriesRef);

  if (root.status === "error") {
    requireExactKeys(
      root,
      [
        "$schema",
        "protocolVersion",
        "kind",
        "requestId",
        "status",
        "seriesRef",
        "error",
      ],
      "/",
    );
    return parseErrorResponse(
      root,
      requestId,
      seriesRef,
    ) as ValidatedAgentAnswerResponse;
  }

  requireLiteral(root.status, "ok", "/status");
  requireExactKeys(
    root,
    [
      "$schema",
      "protocolVersion",
      "kind",
      "requestId",
      "status",
      "seriesRef",
      "answers",
      "agent",
    ],
    "/",
  );

  const answers = parseAnswers(root.answers, request);
  const agent =
    root.agent === undefined ? undefined : parseAgent(root.agent, "/agent");

  const response: AgentAnswerOkResponse = {
    protocolVersion: "1.0.0",
    kind: "nbti.agent-answer.response",
    requestId,
    status: "ok",
    seriesRef,
    answers,
    ...(agent ? { agent } : {}),
  };
  return response as ValidatedAgentAnswerResponse;
}

export function agentResponseToAnswerIndexes(
  response: ValidatedAgentAnswerResponse,
  request: AgentAnswerRequest,
  questionnaire: ValidatedQuestionnaireDocument,
): number[] {
  if (response.status === "error") {
    fail(response.error.code, "/error", response.error.message);
  }
  if (request.mode !== "full-batch") {
    fail(
      "QUESTION_SET_MISMATCH",
      "/mode",
      "only a full-batch response can become a complete score vector",
    );
  }
  const { document, series } = parseQuestionnaireDocument(questionnaire);
  if (document.id !== request.seriesRef.id) {
    fail("SERIES_NOT_FOUND", "/seriesRef/id", "questionnaire ID mismatch");
  }
  if (document.version !== request.seriesRef.version) {
    fail(
      "SERIES_VERSION_MISMATCH",
      "/seriesRef/version",
      "questionnaire version does not match the validated request",
    );
  }
  if (document.contentDigest !== request.seriesRef.contentDigest) {
    fail(
      "SERIES_DIGEST_MISMATCH",
      "/seriesRef/contentDigest",
      "questionnaire digest does not match the validated request",
    );
  }
  assertFullBatchMatchesSeries(request, series);

  const answerByQuestion = new Map(
    response.answers.map((answer) => [answer.questionId, answer.optionId]),
  );
  return series.questions.map((question) => {
    const optionId = answerByQuestion.get(question.id);
    if (!optionId) {
      fail(
        "MISSING_ANSWER",
        `/answers/${question.id}`,
        "missing validated answer",
      );
    }
    const index = optionIndexById(question, optionId);
    if (index < 0) {
      fail(
        "UNKNOWN_OPTION_ID",
        `/answers/${question.id}/optionId`,
        `option ${optionId} does not belong to ${question.id}`,
      );
    }
    return index;
  });
}

function assertFullBatchMatchesSeries(
  request: AgentAnswerRequest,
  series: SeriesDefinition,
): void {
  if (request.questions.length !== series.questions.length) {
    fail(
      "QUESTION_SET_MISMATCH",
      "/questions",
      "full-batch request must contain the complete questionnaire",
    );
  }
  request.questions.forEach((question, index) => {
    const expected = series.questions[index];
    const path = `/questions/${index}`;
    if (
      question.id !== expected.id ||
      question.tag !== expected.tag ||
      question.prompt !== expected.prompt
    ) {
      fail(
        "QUESTION_SET_MISMATCH",
        path,
        "question does not match the canonical public projection",
      );
    }
    if (question.options.length !== expected.options.length) {
      fail(
        "QUESTION_SET_MISMATCH",
        `${path}/options`,
        "option set does not match the canonical public projection",
      );
    }
    question.options.forEach((option, optionIndex) => {
      const expectedOption = expected.options[optionIndex];
      if (
        option.id !== expectedOption.id ||
        option.label !== expectedOption.label
      ) {
        fail(
          "QUESTION_SET_MISMATCH",
          `${path}/options/${optionIndex}`,
          "option does not match the canonical public projection",
        );
      }
    });
  });
}

function parseAnswers(
  value: unknown,
  request: AgentAnswerRequest,
): AgentAnswer[] {
  const items = requireArray(value, "/answers");
  const expectedQuestions = new Map(
    request.questions.map((question) => [question.id, question]),
  );
  if (items.length !== expectedQuestions.size) {
    fail(
      "QUESTION_SET_MISMATCH",
      "/answers",
      `expected ${expectedQuestions.size} answers, received ${items.length}`,
    );
  }

  const seen = new Set<string>();
  const answers = items.map((item, index) => {
    const path = `/answers/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(
      record,
      ["questionId", "optionId", "rationale", "selectionConfidence"],
      path,
    );
    const questionId = requireString(record.questionId, `${path}/questionId`);
    if (seen.has(questionId)) {
      fail("DUPLICATE_ANSWER", `${path}/questionId`, questionId);
    }
    seen.add(questionId);
    const question = expectedQuestions.get(questionId);
    if (!question) {
      fail("UNKNOWN_QUESTION_ID", `${path}/questionId`, questionId);
    }
    const optionId = requireString(record.optionId, `${path}/optionId`);
    if (!question.options.some((option) => option.id === optionId)) {
      fail(
        "UNKNOWN_OPTION_ID",
        `${path}/optionId`,
        `${optionId} does not belong to ${questionId}`,
      );
    }

    const answer: AgentAnswer = { questionId, optionId };
    if (record.rationale !== undefined) {
      if (request.responseOptions.rationale === "omit") {
        fail(
          "OUTPUT_POLICY_VIOLATION",
          `${path}/rationale`,
          "rationale was not requested",
        );
      }
      const rationale = requireBoundedString(
        record.rationale,
        `${path}/rationale`,
        500,
      );
      answer.rationale = rationale;
    }
    if (record.selectionConfidence !== undefined) {
      if (request.responseOptions.selectionConfidence === "omit") {
        fail(
          "OUTPUT_POLICY_VIOLATION",
          `${path}/selectionConfidence`,
          "selection confidence was not requested",
        );
      }
      const confidence = record.selectionConfidence;
      if (
        typeof confidence !== "number" ||
        !Number.isFinite(confidence) ||
        confidence < 0 ||
        confidence > 1
      ) {
        fail(
          "INVALID_AGENT_OUTPUT",
          `${path}/selectionConfidence`,
          "must be between 0 and 1",
        );
      }
      answer.selectionConfidence = confidence;
    }
    return answer;
  });

  for (const questionId of expectedQuestions.keys()) {
    if (!seen.has(questionId)) {
      fail("MISSING_ANSWER", "/answers", `missing ${questionId}`);
    }
  }
  return answers;
}

function parseErrorResponse(
  root: Record<string, unknown>,
  requestId: string,
  seriesRef: AgentSeriesRef,
): AgentAnswerErrorResponse {
  const errorRecord = requireRecord(root.error, "/error");
  requireExactKeys(
    errorRecord,
    ["code", "message", "retryable", "issues"],
    "/error",
  );
  const code = requireString(errorRecord.code, "/error/code");
  if (!errorCodes.has(code as AgentAnswerErrorCode)) {
    fail("INVALID_AGENT_OUTPUT", "/error/code", `unknown error code ${code}`);
  }
  if (typeof errorRecord.retryable !== "boolean") {
    fail("INVALID_AGENT_OUTPUT", "/error/retryable", "must be boolean");
  }
  const issueItems = requireArray(errorRecord.issues, "/error/issues");
  if (issueItems.length > 100) {
    fail("INVALID_AGENT_OUTPUT", "/error/issues", "must contain at most 100 items");
  }
  const issues = issueItems.map(
    (item, index) => {
      const path = `/error/issues/${index}`;
      const record = requireRecord(item, path);
      requireExactKeys(record, ["path", "code"], path);
      return {
        path: requireBoundedString(record.path, `${path}/path`, 300),
        code: requireBoundedString(record.code, `${path}/code`, 80),
      };
    },
  );
  return {
    protocolVersion: "1.0.0",
    kind: "nbti.agent-answer.response",
    requestId,
    status: "error",
    seriesRef,
    error: {
      code: code as AgentAnswerErrorCode,
      message: requireBoundedString(errorRecord.message, "/error/message", 500),
      retryable: errorRecord.retryable,
      issues,
    },
  };
}

function parseSeriesRef(value: unknown, path: string): AgentSeriesRef {
  const record = requireRecord(value, path);
  requireExactKeys(record, ["id", "version", "contentDigest"], path);
  const contentDigest = requireString(
    record.contentDigest,
    `${path}/contentDigest`,
  );
  if (!digestPattern.test(contentDigest)) {
    fail(
      "INVALID_AGENT_OUTPUT",
      `${path}/contentDigest`,
      "invalid digest",
    );
  }
  const id = requireString(record.id, `${path}/id`);
  if (!/^[a-z][a-z0-9-]{0,63}$/.test(id)) {
    fail("INVALID_AGENT_OUTPUT", `${path}/id`, "invalid stable ID");
  }
  const version = requireString(record.version, `${path}/version`);
  if (!/^[1-9][0-9]*$/.test(version)) {
    fail("INVALID_AGENT_OUTPUT", `${path}/version`, "invalid series version");
  }
  return {
    id,
    version,
    contentDigest,
  };
}

function assertSeriesRefMatches(
  actual: AgentSeriesRef,
  expected: AgentSeriesRef,
): void {
  if (actual.id !== expected.id) {
    fail("SERIES_NOT_FOUND", "/seriesRef/id", "series ID mismatch");
  }
  if (actual.version !== expected.version) {
    fail(
      "SERIES_VERSION_MISMATCH",
      "/seriesRef/version",
      "series version mismatch",
    );
  }
  if (actual.contentDigest !== expected.contentDigest) {
    fail(
      "SERIES_DIGEST_MISMATCH",
      "/seriesRef/contentDigest",
      "series digest mismatch",
    );
  }
}

function parseAgent(value: unknown, path: string) {
  const record = requireRecord(value, path);
  requireExactKeys(record, ["id", "provider", "model"], path);
  return {
    id: requireBoundedString(record.id, `${path}/id`, 128),
    ...(record.provider === undefined
      ? {}
      : {
          provider: requireBoundedString(
            record.provider,
            `${path}/provider`,
            80,
          ),
        }),
    ...(record.model === undefined
      ? {}
      : { model: requireBoundedString(record.model, `${path}/model`, 160) }),
  };
}

function seriesRefFromQuestionnaire(
  questionnaire: ValidatedQuestionnaireDocument,
): AgentSeriesRef {
  return {
    id: questionnaire.id,
    version: questionnaire.version,
    contentDigest: questionnaire.contentDigest,
  };
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail("INVALID_AGENT_OUTPUT", path, "must be an object");
  }
  return value as Record<string, unknown>;
}

function requireArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    fail("INVALID_AGENT_OUTPUT", path, "must be an array");
  }
  return value;
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail("INVALID_AGENT_OUTPUT", path, "must be a non-empty string");
  }
  return value;
}

function requireBoundedString(
  value: unknown,
  path: string,
  maxLength: number,
): string {
  const text = requireString(value, path);
  if (Array.from(text).length > maxLength) {
    fail(
      "INVALID_AGENT_OUTPUT",
      path,
      `must contain at most ${maxLength} characters`,
    );
  }
  return text;
}

function requireLiteral<T>(value: unknown, expected: T, path: string): void {
  if (value !== expected) {
    fail("INVALID_AGENT_OUTPUT", path, `must equal ${String(expected)}`);
  }
}

function requireExactKeys(
  record: Record<string, unknown>,
  allowed: string[],
  path: string,
): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(record)) {
    if (!allowedSet.has(key)) {
      fail("INVALID_AGENT_OUTPUT", `${path}/${key}`, "unknown field");
    }
  }
}

function fail(
  code: AgentAnswerErrorCode,
  path: string,
  message: string,
): never {
  throw new AgentAnswerProtocolError(code, path, message);
}
