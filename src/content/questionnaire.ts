import type {
  DimensionKey,
  DimensionWeights,
  ResultType,
  SeriesDefinition,
  WeightValue,
} from "../../contracts/series-definition";
import type {
  QuestionnaireDimension,
  QuestionnaireDocument,
  QuestionnaireQuestion,
} from "../../contracts/questionnaire-json";
import { identityMap, validTypeCodes } from "./identities";

const dimensionKeys = [
  "cognitivePath",
  "driveSource",
  "cognitiveTempo",
  "valueOrientation",
] as const satisfies readonly DimensionKey[];

const endpointIds: Record<DimensionKey, { left: string; right: string }> = {
  cognitivePath: { left: "construction", right: "deconstruction" },
  driveSource: { left: "intuition", right: "logic" },
  cognitiveTempo: { left: "agility", right: "reflection" },
  valueOrientation: { left: "humanism", right: "pragmatism" },
};

const expectedPolarityCounts: Record<DimensionKey, { negative: number; positive: number }> = {
  cognitivePath: { negative: 28, positive: 37 },
  driveSource: { negative: 41, positive: 41 },
  cognitiveTempo: { negative: 31, positive: 41 },
  valueOrientation: { negative: 33, positive: 36 },
};

const stableIdPattern = /^[a-z][a-z0-9-]{0,63}$/;
const digestPattern = /^sha256:[0-9a-f]{64}$/;
declare const validatedQuestionnaireBrand: unique symbol;

export type ValidatedQuestionnaireDocument = QuestionnaireDocument & {
  readonly [validatedQuestionnaireBrand]: true;
};

export class QuestionnaireValidationError extends Error {
  constructor(readonly path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = "QuestionnaireValidationError";
  }
}

export type ParsedQuestionnaire = {
  document: ValidatedQuestionnaireDocument;
  series: SeriesDefinition;
};

export function parseQuestionnaireDocument(input: unknown): ParsedQuestionnaire {
  const root = requireRecord(input, "/");
  requireExactKeys(root, [
    "$schema", "schemaVersion", "kind", "id", "version", "contentDigest",
    "locale", "title", "questionCount", "safety", "dimensions", "questions",
    "resultTypes", "scoring",
  ], "/", ["$schema"]);
  requireLiteral(root.schemaVersion, "2.0.0", "/schemaVersion");
  requireLiteral(root.kind, "nbti.questionnaire", "/kind");
  if (root.$schema !== undefined) requireString(root.$schema, "/$schema");
  const id = requireStableId(root.id, "/id");
  const version = requireString(root.version, "/version");
  if (!/^[1-9][0-9]*$/.test(version)) fail("/version", "must be a positive integer string");
  const contentDigest = requireString(root.contentDigest, "/contentDigest");
  if (!digestPattern.test(contentDigest)) fail("/contentDigest", "must be a sha256 digest");
  const questionCount = requireInteger(root.questionCount, "/questionCount");
  if (questionCount !== 24) fail("/questionCount", "NBTI v2 requires exactly 24 questions");
  validateSafety(root.safety);
  const dimensions = validateDimensions(root.dimensions);
  const questions = validateQuestions(root.questions, questionCount);
  const resultTypes = validateResultTypes(root.resultTypes);
  const scoring = validateScoring(root.scoring);

  const document = deepFreeze({
    ...(typeof root.$schema === "string" ? { $schema: root.$schema } : {}),
    schemaVersion: "2.0.0" as const,
    kind: "nbti.questionnaire" as const,
    id,
    version,
    contentDigest,
    locale: requireString(root.locale, "/locale"),
    title: requireBoundedString(root.title, "/title", 120),
    questionCount,
    safety: {
      notDiagnosis: true as const,
      notPersonalityAssessment: true as const,
      notAbilityRating: true as const,
      statement: requireBoundedString(requireRecord(root.safety, "/safety").statement, "/safety/statement", 300),
    },
    dimensions,
    questions,
    resultTypes,
    scoring,
  }) as ValidatedQuestionnaireDocument;

  return {
    document,
    series: deepFreeze({
      id,
      version,
      title: document.title,
      questions: questions.map(({ order: _order, ...question }) => question),
      resultTypes,
      scoring,
    }),
  };
}

function validateSafety(value: unknown): void {
  const safety = requireRecord(value, "/safety");
  requireExactKeys(safety, ["notDiagnosis", "notPersonalityAssessment", "notAbilityRating", "statement"], "/safety");
  requireLiteral(safety.notDiagnosis, true, "/safety/notDiagnosis");
  requireLiteral(safety.notPersonalityAssessment, true, "/safety/notPersonalityAssessment");
  requireLiteral(safety.notAbilityRating, true, "/safety/notAbilityRating");
  requireBoundedString(safety.statement, "/safety/statement", 300);
}

function validateDimensions(value: unknown): QuestionnaireDimension[] {
  const items = requireArray(value, "/dimensions");
  if (items.length !== 4) fail("/dimensions", "must contain four dimensions");
  return items.map((item, index) => {
    const path = `/dimensions/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(record, ["id", "label", "left", "right", "explanation"], path);
    const expected = dimensionKeys[index];
    const id = requireString(record.id, `${path}/id`);
    if (id !== expected) fail(`${path}/id`, `expected ${expected}`);
    const left = validateEndpoint(record.left, `${path}/left`);
    const right = validateEndpoint(record.right, `${path}/right`);
    if (left.id !== endpointIds[expected].left || right.id !== endpointIds[expected].right) {
      fail(path, "dimension endpoints do not match the NBTI v2 polarity");
    }
    return {
      id: expected,
      label: requireBoundedString(record.label, `${path}/label`, 40),
      left,
      right,
      explanation: requireBoundedString(record.explanation, `${path}/explanation`, 300),
    };
  });
}

function validateEndpoint(value: unknown, path: string) {
  const record = requireRecord(value, path);
  requireExactKeys(record, ["id", "label"], path);
  return { id: requireStableId(record.id, `${path}/id`), label: requireBoundedString(record.label, `${path}/label`, 24) };
}

function validateQuestions(value: unknown, questionCount: number): QuestionnaireQuestion[] {
  const items = requireArray(value, "/questions");
  if (items.length !== questionCount) fail("/questions", "must match questionCount");
  const ids = new Set<string>();
  const optionIds = new Set<string>();
  const counts = Object.fromEntries(dimensionKeys.map((key) => [key, { negative: 0, positive: 0 }])) as Record<DimensionKey, { negative: number; positive: number }>;
  const questions = items.map((item, index) => {
    const path = `/questions/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(record, ["id", "order", "tag", "title", "prompt", "options"], path);
    const id = requireStableId(record.id, `${path}/id`);
    const expectedId = `q${String(index + 1).padStart(2, "0")}`;
    if (id !== expectedId || ids.has(id)) fail(`${path}/id`, `expected unique ${expectedId}`);
    ids.add(id);
    if (requireInteger(record.order, `${path}/order`) !== index + 1) fail(`${path}/order`, `expected ${index + 1}`);
    const optionItems = requireArray(record.options, `${path}/options`);
    if (optionItems.length !== 4) fail(`${path}/options`, "must contain exactly four options");
    const signs = Object.fromEntries(dimensionKeys.map((key) => [key, new Set<number>()])) as Record<DimensionKey, Set<number>>;
    const options = optionItems.map((option, optionIndex) => {
      const optionPath = `${path}/options/${optionIndex}`;
      const optionRecord = requireRecord(option, optionPath);
      requireExactKeys(optionRecord, ["id", "label", "action", "weights"], optionPath);
      const optionId = requireStableId(optionRecord.id, `${optionPath}/id`);
      if (optionId !== `${id}-${optionIndex}` || optionIds.has(optionId)) fail(`${optionPath}/id`, "invalid or duplicate option ID");
      optionIds.add(optionId);
      const weights = validateWeights(optionRecord.weights, `${optionPath}/weights`);
      const nonZero = dimensionKeys.filter((key) => weights[key] !== 0);
      if (nonZero.length < 2 || nonZero.length > 3) fail(`${optionPath}/weights`, "must map exactly two or three dimension polarities");
      for (const key of nonZero) {
        const weight = weights[key];
        signs[key].add(Math.sign(weight));
        if (weight < 0) counts[key].negative += 1;
        if (weight > 0) counts[key].positive += 1;
      }
      return {
        id: optionId,
        label: requireBoundedString(optionRecord.label, `${optionPath}/label`, 300),
        action: requireBoundedString(optionRecord.action, `${optionPath}/action`, 300),
        weights,
      };
    });
    for (const key of dimensionKeys) {
      if (!signs[key].has(-1) || !signs[key].has(1)) fail(`${path}/options`, `${key} must include both polarities`);
    }
    return {
      id,
      order: index + 1,
      tag: requireBoundedString(record.tag, `${path}/tag`, 40),
      title: requireBoundedString(record.title, `${path}/title`, 80),
      prompt: requireBoundedString(record.prompt, `${path}/prompt`, 500),
      options,
    };
  });
  for (const key of dimensionKeys) {
    const expected = expectedPolarityCounts[key];
    if (counts[key].negative !== expected.negative || counts[key].positive !== expected.positive) {
      fail("/questions", `${key} polarity opportunities must be ${expected.negative}/${expected.positive}`);
    }
  }
  return questions;
}

function validateWeights(value: unknown, path: string): DimensionWeights {
  const record = requireRecord(value, path);
  requireExactKeys(record, [...dimensionKeys], path);
  return Object.fromEntries(dimensionKeys.map((key) => {
    const candidate = record[key];
    if (candidate !== -1 && candidate !== 0 && candidate !== 1) fail(`${path}/${key}`, "must be -1, 0, or 1");
    return [key, candidate as WeightValue];
  })) as DimensionWeights;
}

function validateResultTypes(value: unknown): ResultType[] {
  const items = requireArray(value, "/resultTypes");
  if (items.length !== validTypeCodes.length) fail("/resultTypes", "must contain the twelve supported types");
  const seen = new Set<string>();
  return items.map((item, index) => {
    const path = `/resultTypes/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(record, ["id", "code", "label", "shortLabel"], path, ["shortLabel"]);
    const id = requireStableId(record.id, `${path}/id`);
    const code = requireString(record.code, `${path}/code`);
    const identity = identityMap[id];
    if (!identity || identity.code !== code || seen.has(id)) fail(path, "unknown or duplicate result type");
    seen.add(id);
    const label = requireBoundedString(record.label, `${path}/label`, 40);
    if (label !== identity.label) fail(`${path}/label`, `expected ${identity.label}`);
    return { id, code, label, ...(record.shortLabel === undefined ? {} : { shortLabel: requireBoundedString(record.shortLabel, `${path}/shortLabel`, 20) }) };
  });
}

function validateScoring(value: unknown) {
  const record = requireRecord(value, "/scoring");
  requireExactKeys(record, ["medians", "scaleFactor"], "/scoring");
  const mediansRecord = requireRecord(record.medians, "/scoring/medians");
  requireExactKeys(mediansRecord, [...dimensionKeys], "/scoring/medians");
  const medians = Object.fromEntries(dimensionKeys.map((key) => [key, requireInteger(mediansRecord[key], `/scoring/medians/${key}`)])) as Record<DimensionKey, number>;
  const scaleFactor = record.scaleFactor;
  if (typeof scaleFactor !== "number" || !Number.isFinite(scaleFactor) || scaleFactor <= 0) fail("/scoring/scaleFactor", "must be positive");
  return { medians, scaleFactor };
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) fail(path, "must be an object");
  return value as Record<string, unknown>;
}
function requireArray(value: unknown, path: string): unknown[] { if (!Array.isArray(value)) fail(path, "must be an array"); return value; }
function requireString(value: unknown, path: string): string { if (typeof value !== "string" || value.trim().length === 0) fail(path, "must be a non-empty string"); return value; }
function requireBoundedString(value: unknown, path: string, max: number): string { const text = requireString(value, path); if (Array.from(text).length > max) fail(path, `must contain at most ${max} characters`); return text; }
function requireStableId(value: unknown, path: string): string { const id = requireString(value, path); if (!stableIdPattern.test(id) || id.includes(":")) fail(path, "must be a stable lowercase ID"); return id; }
function requireInteger(value: unknown, path: string): number { if (typeof value !== "number" || !Number.isInteger(value)) fail(path, "must be an integer"); return value; }
function requireLiteral<T>(value: unknown, expected: T, path: string): void { if (value !== expected) fail(path, `must equal ${String(expected)}`); }
function requireExactKeys(record: Record<string, unknown>, allowed: string[], path: string, optional: string[] = []): void {
  const allowedSet = new Set(allowed); const optionalSet = new Set(optional);
  for (const key of Object.keys(record)) if (!allowedSet.has(key)) fail(`${path}/${key}`, "unknown field");
  for (const key of allowed) if (!optionalSet.has(key) && !(key in record)) fail(`${path}/${key}`, "missing required field");
}
function deepFreeze<T>(value: T): T { if (value !== null && typeof value === "object" && !Object.isFrozen(value)) { for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child); Object.freeze(value); } return value; }
function fail(path: string, message: string): never { throw new QuestionnaireValidationError(path, message); }
