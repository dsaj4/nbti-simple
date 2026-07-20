import { describe, expect, it } from "vitest";
import Ajv2020 from "ajv/dist/2020";
import type {
  AgentAnswerOkResponse,
  AgentAnswerRequest,
} from "../contracts/agent-answer";
import agentRequestSchema from "../contracts/json-schema/nbti-agent-request.v1.schema.json";
import agentResponseSchema from "../contracts/json-schema/nbti-agent-response.v1.schema.json";
import questionnaireSchema from "../contracts/json-schema/nbti-questionnaire.v1.schema.json";
import agentRequestExample from "../docs/examples/nbti-agent-request.single.v1.json";
import agentErrorResponseExample from "../docs/examples/nbti-agent-response.error.v1.json";
import agentResponseExample from "../docs/examples/nbti-agent-response.ok.v1.json";
import { identityMap } from "../src/content/identities";
import rawQuestionnaire from "../src/content/nbti-mvp.v1.json";
import {
  nbtiQuestionnaire,
  nbtiSeries,
} from "../src/content/series";
import {
  parseQuestionnaireDocument,
  QuestionnaireValidationError,
} from "../src/content/questionnaire";
import {
  assertQuestionnaireDigest,
  computeQuestionnaireDigest,
} from "../src/content/questionnaireDigest";
import { computeDimensionBounds, scoreAnswers } from "../src/domain/scoring";
import {
  AgentAnswerProtocolError,
  agentResponseToAnswerIndexes,
  buildAgentAnswerRequest,
  createAgentRequestId,
  parseAgentAnswerResponse,
} from "../src/features/agent/answerProtocol";
import { decodeResult } from "../src/features/share/codec";

describe("questionnaire JSON contract", () => {
  it("uses JSON Schema Draft 2020-12 for all three contracts", () => {
    for (const schema of [
      questionnaireSchema,
      agentRequestSchema,
      agentResponseSchema,
    ]) {
      expect(schema.$schema).toBe(
        "https://json-schema.org/draft/2020-12/schema",
      );
    }
  });

  it("compiles every schema and validates canonical documents", () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    const validateQuestionnaire = ajv.compile(questionnaireSchema);
    const validateRequest = ajv.compile(agentRequestSchema);
    const validateResponse = ajv.compile(agentResponseSchema);

    expect(
      validateQuestionnaire(rawQuestionnaire),
      JSON.stringify(validateQuestionnaire.errors),
    ).toBe(true);
    expect(
      validateRequest(agentRequestExample),
      JSON.stringify(validateRequest.errors),
    ).toBe(true);
    expect(
      validateResponse(agentResponseExample),
      JSON.stringify(validateResponse.errors),
    ).toBe(true);
    expect(
      validateResponse(agentErrorResponseExample),
      JSON.stringify(validateResponse.errors),
    ).toBe(true);
    const generatedRequest = buildFullBatchRequest();
    expect(
      validateRequest(generatedRequest),
      JSON.stringify(validateRequest.errors),
    ).toBe(true);
    expect(
      validateResponse(okResponseFor(generatedRequest, 0)),
      JSON.stringify(validateResponse.errors),
    ).toBe(true);

    const leakedRequest = structuredClone(agentRequestExample) as unknown as {
      questions: Array<{ options: Array<Record<string, unknown>> }>;
    };
    leakedRequest.questions[0].options[0].weights = { organization: -2 };
    expect(validateRequest(leakedRequest)).toBe(false);
  });

  it("loads all current questions from the canonical JSON document", () => {
    const parsed = parseQuestionnaireDocument(rawQuestionnaire);
    expect(parsed.series).toEqual(nbtiSeries);
    expect(parsed.document).toEqual(nbtiQuestionnaire);
    expect(parsed.series.questions.map((question) => question.id)).toEqual(
      Array.from({ length: 12 }, (_, index) =>
        `q${String(index + 1).padStart(2, "0")}`,
      ),
    );
    expect(
      parsed.series.questions.flatMap((question) =>
        question.options.map((option) => option.id),
      ),
    ).toHaveLength(48);
  });

  it("matches the stored content digest", async () => {
    expect(await computeQuestionnaireDigest(rawQuestionnaire)).toBe(
      rawQuestionnaire.contentDigest,
    );
  });

  it("detects stale digests and freezes validated content", async () => {
    const changed = structuredClone(rawQuestionnaire);
    changed.questions[0].prompt += "（已修改）";
    expect(await computeQuestionnaireDigest(changed)).not.toBe(
      changed.contentDigest,
    );
    await expect(assertQuestionnaireDigest(changed)).rejects.toThrow(
      /digest mismatch/,
    );
    expect(Object.isFrozen(nbtiQuestionnaire)).toBe(true);
    expect(Object.isFrozen(nbtiQuestionnaire.questions[0].options)).toBe(true);
  });

  it("preserves the balanced scoring matrix and report identities", () => {
    expect(computeDimensionBounds(nbtiSeries)).toEqual({
      organization: { min: -12, max: 12 },
      calibration: { min: -12, max: 12 },
      momentum: { min: -12, max: 12 },
      scope: { min: -12, max: 12 },
    });
    expect(new Set(nbtiSeries.resultTypes.map((result) => result.id))).toEqual(
      new Set(Object.keys(identityMap)),
    );
  });

  it("preserves the positional meaning of an existing v1 share link", () => {
    const decoded = decodeResult(
      "#report/nbti-mvp:1:213322333232",
      nbtiSeries.questions.length,
    );
    expect(decoded).toEqual({
      ok: true,
      value: {
        seriesId: "nbti-mvp",
        version: "1",
        answers: [2, 1, 3, 3, 2, 2, 3, 3, 3, 2, 3, 2],
      },
    });
    if (decoded.ok) {
      expect(
        scoreAnswers(nbtiSeries, decoded.value.answers).primaryResultId,
      ).toBe("multi-path");
    }
  });

  it("rejects duplicate IDs and malformed current-profile weights", () => {
    const duplicate = structuredClone(rawQuestionnaire);
    duplicate.questions[1].id = duplicate.questions[0].id;
    expect(() => parseQuestionnaireDocument(duplicate)).toThrow(
      QuestionnaireValidationError,
    );

    const multiWeight = structuredClone(rawQuestionnaire);
    multiWeight.questions[0].options[0].weights.scope = 2;
    expect(() => parseQuestionnaireDocument(multiWeight)).toThrow(
      /exactly one non-zero weight/,
    );

    const unbalanced = structuredClone(rawQuestionnaire);
    unbalanced.questions[0].options[1].weights.organization = -2;
    expect(() => parseQuestionnaireDocument(unbalanced)).toThrow(
      /balance two dimensions/,
    );
  });

  it("keeps current result identities fixed while allowing shortLabel omission", () => {
    const unknownResult = structuredClone(rawQuestionnaire);
    unknownResult.resultTypes[0].id = "replacement";
    expect(() => parseQuestionnaireDocument(unknownResult)).toThrow(
      /unknown result type/,
    );

    const optionalShortLabel = structuredClone(rawQuestionnaire);
    delete (optionalShortLabel.resultTypes[0] as { shortLabel?: string })
      .shortLabel;
    expect(() => parseQuestionnaireDocument(optionalShortLabel)).not.toThrow();

    const invalidSchemaPointer = structuredClone(rawQuestionnaire) as unknown as {
      $schema: unknown;
    };
    invalidSchemaPointer.$schema = 42;
    expect(() => parseQuestionnaireDocument(invalidSchemaPointer)).toThrow(
      "/$schema",
    );
  });
});

describe("agent answer JSON protocol", () => {
  it("creates opaque request IDs", () => {
    const first = createAgentRequestId();
    const second = createAgentRequestId();
    expect(first).toMatch(/^req-[A-Za-z0-9_-]{4,120}$/);
    expect(second).not.toBe(first);
  });

  it("builds an agent-safe projection without scoring or report metadata", () => {
    const request = buildFullBatchRequest();
    const serialized = JSON.stringify(request);

    expect(request.questions).toHaveLength(12);
    expect(serialized).not.toContain("weights");
    expect(serialized).not.toContain("action");
    expect(serialized).not.toContain("resultTypes");
    expect(serialized).not.toContain("deconstructor");
    expect(request.constraints.scoringMetadataIncluded).toBe(false);
  });

  it("supports a one-question request while keeping stable IDs", () => {
    const request = buildAgentAnswerRequest(nbtiQuestionnaire, {
      requestId: "req-single-q03",
      mode: "single",
      questionId: "q03",
    });
    expect(request.questions.map((question) => question.id)).toEqual(["q03"]);
    expect(request.questions[0].options.map((option) => option.id)).toEqual([
      "q03-0",
      "q03-1",
      "q03-2",
      "q03-3",
    ]);
  });

  it("maps shuffled ID-based answers back to the existing score vector", () => {
    const request = buildFullBatchRequest();
    const rawResponse = okResponseFor(request, 0);
    rawResponse.answers.reverse();

    const response = parseAgentAnswerResponse(rawResponse, request);
    const indexes = agentResponseToAnswerIndexes(
      response,
      request,
      nbtiQuestionnaire,
    );

    expect(indexes).toEqual(Array(12).fill(0));
    expect(scoreAnswers(nbtiSeries, indexes).primaryResultId).toBe("deconstructor");
  });

  it("keeps rationale and confidence outside deterministic scoring", () => {
    const request = buildAgentAnswerRequest(nbtiQuestionnaire, {
      requestId: "req-metadata-test",
      mode: "full-batch",
      rationale: "optional",
      selectionConfidence: "optional",
    });
    const plain = okResponseFor(request, 1);
    const annotated = okResponseFor(request, 1);
    annotated.answers = annotated.answers.map((answer) => ({
      ...answer,
      rationale: "只解释当前情境中的选择。",
      selectionConfidence: 0.73,
    }));

    const plainIndexes = agentResponseToAnswerIndexes(
      parseAgentAnswerResponse(plain, request),
      request,
      nbtiQuestionnaire,
    );
    const annotatedIndexes = agentResponseToAnswerIndexes(
      parseAgentAnswerResponse(annotated, request),
      request,
      nbtiQuestionnaire,
    );

    expect(annotatedIndexes).toEqual(plainIndexes);
    expect(scoreAnswers(nbtiSeries, annotatedIndexes)).toEqual(
      scoreAnswers(nbtiSeries, plainIndexes),
    );
  });

  it("rejects missing, duplicate, cross-question, and mismatched answers", () => {
    const request = buildFullBatchRequest();

    const missing = okResponseFor(request, 0);
    missing.answers.pop();
    expectProtocolError(missing, request, "QUESTION_SET_MISMATCH");

    const duplicate = okResponseFor(request, 0);
    duplicate.answers[1] = { ...duplicate.answers[0] };
    expectProtocolError(duplicate, request, "DUPLICATE_ANSWER");

    const crossQuestion = okResponseFor(request, 0);
    crossQuestion.answers[0].optionId = "q02-0";
    expectProtocolError(crossQuestion, request, "UNKNOWN_OPTION_ID");

    const wrongVersion = okResponseFor(request, 0);
    wrongVersion.seriesRef.version = "2";
    expectProtocolError(wrongVersion, request, "SERIES_VERSION_MISMATCH");

    const wrongDigest = okResponseFor(request, 0);
    wrongDigest.seriesRef.contentDigest = `sha256:${"f".repeat(64)}`;
    expectProtocolError(wrongDigest, request, "SERIES_DIGEST_MISMATCH");
  });

  it("rejects optional output that the request did not authorize", () => {
    const request = buildFullBatchRequest();
    const response = okResponseFor(request, 0);
    response.answers[0].rationale = "未被请求的解释";
    expectProtocolError(response, request, "OUTPUT_POLICY_VIOLATION");
  });

  it("rejects a forged partial full-batch and non-finite confidence", () => {
    const fullRequest = buildFullBatchRequest();
    const partialRequest: AgentAnswerRequest = {
      ...fullRequest,
      questions: [fullRequest.questions[0]],
    };
    const partialResponse = parseAgentAnswerResponse(
      okResponseFor(partialRequest, 0),
      partialRequest,
    );
    expect(() =>
      agentResponseToAnswerIndexes(
        partialResponse,
        partialRequest,
        nbtiQuestionnaire,
      ),
    ).toThrow(/complete questionnaire/);

    const confidenceRequest = buildAgentAnswerRequest(nbtiQuestionnaire, {
      requestId: "req-nan-confidence",
      mode: "full-batch",
      selectionConfidence: "optional",
    });
    const nonFinite = okResponseFor(confidenceRequest, 0);
    nonFinite.answers[0].selectionConfidence = Number.NaN;
    expectProtocolError(nonFinite, confidenceRequest, "INVALID_AGENT_OUTPUT");
  });
});

function buildFullBatchRequest(): AgentAnswerRequest {
  return buildAgentAnswerRequest(nbtiQuestionnaire, {
    requestId: "req-full-batch-v1",
    mode: "full-batch",
  });
}

function okResponseFor(
  request: AgentAnswerRequest,
  optionIndex: number,
): AgentAnswerOkResponse {
  return {
    protocolVersion: "1.0.0",
    kind: "nbti.agent-answer.response",
    requestId: request.requestId,
    status: "ok",
    seriesRef: { ...request.seriesRef },
    answers: request.questions.map((question) => ({
      questionId: question.id,
      optionId: question.options[optionIndex].id,
    })),
  };
}

function expectProtocolError(
  response: unknown,
  request: AgentAnswerRequest,
  code: AgentAnswerProtocolError["code"],
): void {
  try {
    parseAgentAnswerResponse(response, request);
    throw new Error(`Expected protocol error ${code}`);
  } catch (error) {
    expect(error).toBeInstanceOf(AgentAnswerProtocolError);
    expect((error as AgentAnswerProtocolError).code).toBe(code);
  }
}
