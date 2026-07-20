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
import { identityMap } from "./identities";

const dimensionKeys = [
  "organization",
  "calibration",
  "momentum",
  "scope",
] as const satisfies readonly DimensionKey[];

const allowedWeights = new Set<WeightValue>([-2, -1, 0, 1, 2]);
const stableIdPattern = /^[a-z][a-z0-9-]{0,63}$/;
const digestPattern = /^sha256:[0-9a-f]{64}$/;
const localePattern = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;
const endpointIds: Record<DimensionKey, { left: string; right: string }> = {
  organization: { left: "decompose", right: "associate" },
  calibration: { left: "evidence", right: "context" },
  momentum: { left: "anchor", right: "probe" },
  scope: { left: "global", right: "proximate" },
};

declare const validatedQuestionnaireBrand: unique symbol;

export type ValidatedQuestionnaireDocument = QuestionnaireDocument & {
  readonly [validatedQuestionnaireBrand]: true;
};

export class QuestionnaireValidationError extends Error {
  constructor(
    readonly path: string,
    message: string,
  ) {
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
  requireExactKeys(
    root,
    [
      "$schema",
      "schemaVersion",
      "kind",
      "id",
      "version",
      "contentDigest",
      "locale",
      "title",
      "questionCount",
      "safety",
      "dimensions",
      "questions",
      "resultTypes",
    ],
    "/",
  );

  requireLiteral(root.schemaVersion, "1.0.0", "/schemaVersion");
  requireLiteral(root.kind, "nbti.questionnaire", "/kind");
  if (root.$schema !== undefined) {
    requireString(root.$schema, "/$schema");
  }
  const id = requireStableId(root.id, "/id");
  const version = requireString(root.version, "/version");
  if (!/^[1-9][0-9]*$/.test(version)) {
    fail("/version", "must be a positive integer string");
  }
  const contentDigest = requireString(root.contentDigest, "/contentDigest");
  if (!digestPattern.test(contentDigest)) {
    fail("/contentDigest", "must be a sha256 digest");
  }
  const locale = requireString(root.locale, "/locale");
  if (!localePattern.test(locale)) {
    fail("/locale", "must be a supported locale identifier");
  }
  const title = requireBoundedString(root.title, "/title", 120);
  const questionCount = requireInteger(root.questionCount, "/questionCount");

  validateSafety(root.safety);
  const dimensions = validateDimensions(root.dimensions);
  const questions = validateQuestions(root.questions, questionCount);
  const resultTypes = validateResultTypes(root.resultTypes);

  const document = deepFreeze({
    ...(typeof root.$schema === "string" ? { $schema: root.$schema } : {}),
    schemaVersion: "1.0.0",
    kind: "nbti.questionnaire",
    id,
    version,
    contentDigest,
    locale,
    title,
    questionCount,
    safety: {
      notDiagnosis: true,
      notPersonalityAssessment: true,
      notAbilityRating: true,
      statement: requireBoundedString(
        requireRecord(root.safety, "/safety").statement,
        "/safety/statement",
        300,
      ),
    },
    dimensions,
    questions,
    resultTypes,
  } as ValidatedQuestionnaireDocument);

  return {
    document,
    series: deepFreeze({
      id,
      version,
      title,
      questions: questions.map(({ order: _order, ...question }) => question),
      resultTypes,
    }),
  };
}

function validateSafety(value: unknown): void {
  const safety = requireRecord(value, "/safety");
  requireExactKeys(
    safety,
    [
      "notDiagnosis",
      "notPersonalityAssessment",
      "notAbilityRating",
      "statement",
    ],
    "/safety",
  );
  requireLiteral(safety.notDiagnosis, true, "/safety/notDiagnosis");
  requireLiteral(
    safety.notPersonalityAssessment,
    true,
    "/safety/notPersonalityAssessment",
  );
  requireLiteral(safety.notAbilityRating, true, "/safety/notAbilityRating");
  requireBoundedString(safety.statement, "/safety/statement", 300);
}

function validateDimensions(value: unknown): QuestionnaireDimension[] {
  const items = requireArray(value, "/dimensions");
  if (items.length !== dimensionKeys.length) {
    fail("/dimensions", `must contain ${dimensionKeys.length} dimensions`);
  }

  const seen = new Set<string>();
  const dimensions = items.map((item, index) => {
    const path = `/dimensions/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(
      record,
      ["id", "label", "left", "right", "explanation"],
      path,
    );
    const id = requireStableId(record.id, `${path}/id`);
    const expectedId = dimensionKeys[index];
    if (id !== expectedId) fail(`${path}/id`, `expected ${expectedId}`);
    if (seen.has(id)) fail(`${path}/id`, `duplicate dimension ${id}`);
    seen.add(id);

    const left = validateEndpoint(record.left, `${path}/left`);
    const right = validateEndpoint(record.right, `${path}/right`);
    if (left.id !== endpointIds[expectedId].left) {
      fail(`${path}/left/id`, `expected ${endpointIds[expectedId].left}`);
    }
    if (right.id !== endpointIds[expectedId].right) {
      fail(`${path}/right/id`, `expected ${endpointIds[expectedId].right}`);
    }

    return {
      id: id as DimensionKey,
      label: requireBoundedString(record.label, `${path}/label`, 40),
      left,
      right,
      explanation: requireBoundedString(
        record.explanation,
        `${path}/explanation`,
        300,
      ),
    };
  });

  for (const key of dimensionKeys) {
    if (!seen.has(key)) fail("/dimensions", `missing dimension ${key}`);
  }
  return dimensions;
}

function validateEndpoint(value: unknown, path: string) {
  const record = requireRecord(value, path);
  requireExactKeys(record, ["id", "label"], path);
  return {
    id: requireStableId(record.id, `${path}/id`),
    label: requireBoundedString(record.label, `${path}/label`, 24),
  };
}

function validateQuestions(
  value: unknown,
  questionCount: number,
): QuestionnaireQuestion[] {
  const items = requireArray(value, "/questions");
  if (questionCount !== items.length) {
    fail("/questionCount", "must equal questions.length");
  }
  if (questionCount !== 12) {
    fail("/questionCount", "NBTI v1 profile requires exactly 12 questions");
  }

  const questionIds = new Set<string>();
  const optionIds = new Set<string>();
  const signCounts = Object.fromEntries(
    dimensionKeys.map((key) => [key, { negative: 0, positive: 0 }]),
  ) as Record<DimensionKey, { negative: number; positive: number }>;

  const questions = items.map((item, index) => {
    const path = `/questions/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(
      record,
      ["id", "order", "tag", "title", "prompt", "options"],
      path,
    );
    const id = requireStableId(record.id, `${path}/id`);
    const expectedId = `q${String(index + 1).padStart(2, "0")}`;
    if (id !== expectedId) fail(`${path}/id`, `expected ${expectedId}`);
    if (questionIds.has(id)) fail(`${path}/id`, `duplicate question ${id}`);
    questionIds.add(id);

    const order = requireInteger(record.order, `${path}/order`);
    if (order !== index + 1) fail(`${path}/order`, `expected ${index + 1}`);
    const tag = requireBoundedString(record.tag, `${path}/tag`, 40);
    if (tag.includes(" · ")) {
      fail(`${path}/tag`, "must not contain the evidence delimiter ' · '");
    }

    const optionItems = requireArray(record.options, `${path}/options`);
    if (optionItems.length !== 4) {
      fail(`${path}/options`, "NBTI v1 profile requires exactly 4 options");
    }
    const dimensionsInQuestion = new Map<DimensionKey, Set<number>>();
    const options = optionItems.map((option, optionIndex) => {
      const optionPath = `${path}/options/${optionIndex}`;
      const optionRecord = requireRecord(option, optionPath);
      requireExactKeys(
        optionRecord,
        ["id", "label", "action", "weights"],
        optionPath,
      );
      const optionId = requireStableId(optionRecord.id, `${optionPath}/id`);
      const expectedOptionId = `${id}-${optionIndex}`;
      if (optionId !== expectedOptionId) {
        fail(`${optionPath}/id`, `expected ${expectedOptionId}`);
      }
      if (optionIds.has(optionId)) {
        fail(`${optionPath}/id`, `duplicate option ${optionId}`);
      }
      optionIds.add(optionId);

      const weights = validateWeights(optionRecord.weights, `${optionPath}/weights`);
      const nonZero = dimensionKeys.filter((key) => weights[key] !== 0);
      if (nonZero.length !== 1 || Math.abs(weights[nonZero[0]]) !== 2) {
        fail(
          `${optionPath}/weights`,
          "NBTI v1 profile requires exactly one non-zero weight with absolute value 2",
        );
      }
      const dimension = nonZero[0];
      const weight = weights[dimension];
      const signs = dimensionsInQuestion.get(dimension) ?? new Set<number>();
      signs.add(Math.sign(weight));
      dimensionsInQuestion.set(dimension, signs);
      if (weight < 0) signCounts[dimension].negative += 1;
      if (weight > 0) signCounts[dimension].positive += 1;

      return {
        id: optionId,
        label: requireBoundedString(
          optionRecord.label,
          `${optionPath}/label`,
          240,
        ),
        action: requireBoundedString(
          optionRecord.action,
          `${optionPath}/action`,
          240,
        ),
        weights,
      };
    });

    if (
      dimensionsInQuestion.size !== 2 ||
      Array.from(dimensionsInQuestion.values()).some(
        (signs) => !signs.has(-1) || !signs.has(1),
      )
    ) {
      fail(
        `${path}/options`,
        "each NBTI v1 question must balance two dimensions in both directions",
      );
    }

    return {
      id,
      order,
      tag,
      title: requireBoundedString(record.title, `${path}/title`, 80),
      prompt: requireBoundedString(record.prompt, `${path}/prompt`, 500),
      options,
    };
  });

  for (const key of dimensionKeys) {
    if (signCounts[key].negative !== 6 || signCounts[key].positive !== 6) {
      fail(
        "/questions",
        `${key} must have 6 negative and 6 positive options in NBTI v1`,
      );
    }
  }

  return questions;
}

function validateWeights(value: unknown, path: string): DimensionWeights {
  const record = requireRecord(value, path);
  requireExactKeys(record, [...dimensionKeys], path);
  return Object.fromEntries(
    dimensionKeys.map((key) => {
      const candidate = record[key];
      if (
        typeof candidate !== "number" ||
        !Number.isInteger(candidate) ||
        !allowedWeights.has(candidate as WeightValue)
      ) {
        fail(`${path}/${key}`, "must be an integer in [-2, -1, 0, 1, 2]");
      }
      return [key, candidate as WeightValue];
    }),
  ) as DimensionWeights;
}

function validateResultTypes(value: unknown): ResultType[] {
  const items = requireArray(value, "/resultTypes");
  const expectedIds = Object.keys(identityMap);
  if (items.length !== expectedIds.length) {
    fail(
      "/resultTypes",
      `NBTI v1 profile requires exactly ${expectedIds.length} result types`,
    );
  }
  const seen = new Set<string>();
  const resultTypes = items.map((item, index) => {
    const path = `/resultTypes/${index}`;
    const record = requireRecord(item, path);
    requireExactKeys(
      record,
      ["id", "label", "shortLabel"],
      path,
      ["shortLabel"],
    );
    const id = requireStableId(record.id, `${path}/id`);
    if (seen.has(id)) fail(`${path}/id`, `duplicate result type ${id}`);
    const identity = identityMap[id];
    if (!identity) fail(`${path}/id`, `unknown result type ${id}`);
    seen.add(id);
    const label = requireBoundedString(record.label, `${path}/label`, 40);
    if (label !== identity.label) {
      fail(`${path}/label`, `must match the report identity label ${identity.label}`);
    }
    return {
      id,
      label,
      ...(record.shortLabel === undefined
        ? {}
        : {
            shortLabel: requireBoundedString(
              record.shortLabel,
              `${path}/shortLabel`,
              20,
            ),
          }),
    };
  });
  for (const id of expectedIds) {
    if (!seen.has(id)) fail("/resultTypes", `missing result type ${id}`);
  }
  return resultTypes;
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail(path, "must be an object");
  }
  return value as Record<string, unknown>;
}

function requireArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, "must be an array");
  return value;
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(path, "must be a non-empty string");
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
    fail(path, `must contain at most ${maxLength} characters`);
  }
  return text;
}

function requireStableId(value: unknown, path: string): string {
  const id = requireString(value, path);
  if (!stableIdPattern.test(id) || id.includes(":")) {
    fail(path, "must be a stable lowercase ID without ':'");
  }
  return id;
}

function requireInteger(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    fail(path, "must be an integer");
  }
  return value;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function requireLiteral<T>(value: unknown, expected: T, path: string): void {
  if (value !== expected) fail(path, `must equal ${String(expected)}`);
}

function requireExactKeys(
  record: Record<string, unknown>,
  allowed: string[],
  path: string,
  optional: string[] = [],
): void {
  const allowedSet = new Set(allowed);
  const optionalSet = new Set(optional);
  for (const key of Object.keys(record)) {
    if (!allowedSet.has(key)) fail(`${path}/${key}`, "unknown field");
  }
  for (const key of allowed) {
    if (key === "$schema" || optionalSet.has(key)) continue;
    if (!(key in record)) fail(`${path}/${key}`, "missing required field");
  }
}

function fail(path: string, message: string): never {
  throw new QuestionnaireValidationError(path, message);
}
