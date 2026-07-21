const REPORT_PREFIX = "report/";

export type EncodedResult = {
  seriesId: string;
  version: string;
  answers: number[];
};

export type DecodeResult =
  | { ok: true; value: EncodedResult }
  | { ok: false; reason: string };

export type SeriesShareProfile = {
  seriesId: string;
  version: string;
  questionCount: number;
  maxOptionIndex?: number;
};

function optionToChar(index: number): string {
  if (index < 0 || index > 35) {
    throw new Error("Option index out of base36 range");
  }
  return index.toString(36);
}

function charToOption(char: string): number {
  const value = parseInt(char, 36);
  if (Number.isNaN(value) || value < 0 || value > 35) {
    throw new Error(`Invalid base36 character: ${char}`);
  }
  return value;
}

export function encodeResult(
  seriesId: string,
  version: string,
  answers: number[],
): string {
  const encodedAnswers = answers.map(optionToChar).join("");
  return `${REPORT_PREFIX}${seriesId}:${version}:${encodedAnswers}`;
}

export function decodeResult(
  hash: string,
  expectedQuestionCount: number,
  maxOptionIndex = 3,
): DecodeResult {
  if (!hash.startsWith("#")) {
    return { ok: false, reason: "链接格式不正确" };
  }

  const path = hash.slice(1);
  if (!path.startsWith(REPORT_PREFIX)) {
    return { ok: false, reason: "链接格式不正确" };
  }

  const payload = path.slice(REPORT_PREFIX.length);
  const parts = payload.split(":");
  if (parts.length !== 3) {
    return { ok: false, reason: "链接缺少必要信息" };
  }

  const [seriesId, version, encodedAnswers] = parts;

  if (!seriesId || !version) {
    return { ok: false, reason: "链接缺少系列信息" };
  }

  if (encodedAnswers.length !== expectedQuestionCount) {
    return {
      ok: false,
      reason: `答案数量不正确，需要 ${expectedQuestionCount} 道题`,
    };
  }

  const answers: number[] = [];
  for (const char of encodedAnswers) {
    try {
      const value = charToOption(char);
      if (value < 0 || value > maxOptionIndex) {
        return { ok: false, reason: "答案编码包含无效选项" };
      }
      answers.push(value);
    } catch {
      return { ok: false, reason: "答案编码包含无效字符" };
    }
  }

  return {
    ok: true,
    value: { seriesId, version, answers },
  };
}

export function decodeKnownResult(
  hash: string,
  profiles: SeriesShareProfile[],
): DecodeResult {
  const match = hash.match(/^#report\/([^:]+):([^:]+):/);
  if (!match) return { ok: false, reason: "链接格式不正确" };
  const profile = profiles.find(
    (candidate) => candidate.seriesId === match[1] && candidate.version === match[2],
  );
  if (!profile) return { ok: false, reason: "分享链接对应的测试版本无法识别。" };
  return decodeResult(hash, profile.questionCount, profile.maxOptionIndex ?? 3);
}

export function readReportHash(): string | undefined {
  const hash = window.location.hash;
  return hash.startsWith(`#${REPORT_PREFIX}`) ? hash : undefined;
}

export function writeReportHash(hash: string): void {
  window.location.hash = hash;
}

export function clearReportHash(): void {
  // eslint-disable-next-line no-restricted-globals
  history.replaceState(null, "", location.pathname + location.search);
}
