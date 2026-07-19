import { describe, expect, it } from "vitest";
import {
  decodeResult,
  encodeResult,
} from "../src/features/share/codec";

describe("result codec", () => {
  it("round-trips a valid answer sequence", () => {
    const answers = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
    const encoded = encodeResult("nbti-mvp", "1", answers);
    const decoded = decodeResult(`#${encoded}`, answers.length);
    expect(decoded).toEqual({
      ok: true,
      value: { seriesId: "nbti-mvp", version: "1", answers },
    });
  });

  it("rejects a hash without the report prefix", () => {
    const decoded = decodeResult("#other/abc", 12);
    expect(decoded.ok).toBe(false);
  });

  it("rejects a hash with the wrong number of answers", () => {
    const encoded = encodeResult("nbti-mvp", "1", [0, 1, 2]);
    const decoded = decodeResult(`#${encoded}`, 12);
    expect(decoded.ok).toBe(false);
    if (!decoded.ok) {
      expect(decoded.reason).toContain("12");
    }
  });

  it("rejects a hash with invalid characters", () => {
    const decoded = decodeResult("#report/nbti-mvp:1:zzzzzzzzzzzz", 12);
    expect(decoded.ok).toBe(false);
  });

  it("rejects a hash with missing parts", () => {
    const decoded = decodeResult("#report/nbti-mvp:1", 12);
    expect(decoded.ok).toBe(false);
  });
});
