function canonicalizeValue(value: unknown, isRoot = false): unknown {
  if (typeof value === "string") {
    return value.normalize("NFC");
  }

  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeValue(item));
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .filter(
          (key) =>
            !isRoot || (key !== "$schema" && key !== "contentDigest"),
        )
        .sort()
        .map((key) => [key, canonicalizeValue(record[key])]),
    );
  }

  return value;
}

export function canonicalizeQuestionnaire(value: unknown): string {
  return JSON.stringify(canonicalizeValue(value, true));
}

export async function computeQuestionnaireDigest(
  value: unknown,
): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalizeQuestionnaire(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `sha256:${hex}`;
}

export async function assertQuestionnaireDigest(value: unknown): Promise<void> {
  const stored =
    value !== null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>).contentDigest
      : undefined;
  const computed = await computeQuestionnaireDigest(value);
  if (stored !== computed) {
    throw new Error(
      `Questionnaire content digest mismatch: expected ${String(stored)}, computed ${computed}`,
    );
  }
}
