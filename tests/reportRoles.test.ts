import { describe, expect, it } from "vitest";
import type { DimensionKey } from "../contracts/score-result";
import {
  reportRoleForIdentity,
  reportRoleIds,
  reportRoleMap,
} from "../src/content/reportRoles";
import { nbtiSeries } from "../src/content/series";
import { buildReportViewModel } from "../src/domain/report";

const zeroPositions = (): Record<DimensionKey, number> => ({
  organization: 0,
  calibration: 0,
  momentum: 0,
  scope: 0,
});

describe("report role presentation layer", () => {
  it("keeps the weak-signal fallback as 多路者", () => {
    expect(reportRoleForIdentity("multi-path", zeroPositions()).label).toBe(
      "多路者",
    );
  });

  it("makes all fifteen network roles reachable without changing scoring IDs", () => {
    const cases: Array<[string, DimensionKey | null, number, string]> = [
      ["deconstructor", "momentum", 1, "stress-tester"],
      ["deconstructor", "momentum", -1, "human-computer"],
      ["connector", "calibration", -1, "cyber-adjudicator"],
      ["connector", "calibration", 1, "system-maximalist"],
      ["calibrator", "scope", -1, "watchdog"],
      ["calibrator", "scope", 1, "noise-sweeper"],
      ["context-reader", "organization", -1, "wall-breaker"],
      ["context-reader", "organization", 1, "signal-clarifier"],
      ["anchor", "calibration", -1, "imprint-system"],
      ["anchor", "calibration", 1, "fixed-bearing"],
      ["explorer", "scope", -1, "probability-navigator"],
      ["explorer", "scope", 1, "iteration-engine"],
      ["overlooker", null, 0, "rooted-systems-reader"],
      ["present", "organization", -1, "specialist"],
      ["present", "organization", 1, "momentum-pump"],
    ];

    const selected = new Set(
      cases.map(([identityId, dimension, value, expected]) => {
        const positions = zeroPositions();
        if (dimension) positions[dimension] = value;
        const role = reportRoleForIdentity(identityId, positions);
        expect(role.id).toBe(expected);
        return role.id;
      }),
    );

    expect(selected).toEqual(
      new Set(reportRoleIds.filter((roleId) => roleId !== "multi-path")),
    );
  });

  it("reaches every strong role through a valid questionnaire answer sequence", () => {
    const witnesses: Record<string, number[]> = {
      "human-computer": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "stress-tester": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      watchdog: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      "noise-sweeper": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3],
      "imprint-system": [0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 1, 0],
      "rooted-systems-reader": [0, 0, 0, 0, 0, 1, 2, 0, 2, 1, 3, 2],
      specialist: [0, 0, 0, 0, 0, 1, 3, 0, 3, 1, 3, 3],
      "probability-navigator": [0, 0, 0, 0, 0, 2, 1, 3, 2, 2, 3, 1],
      "iteration-engine": [0, 0, 0, 0, 0, 2, 1, 3, 1, 2, 3, 1],
      "fixed-bearing": [0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 0],
      "wall-breaker": [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 3, 1],
      "signal-clarifier": [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 1],
      "momentum-pump": [0, 0, 0, 0, 0, 1, 3, 1, 3, 1, 1, 3],
      "cyber-adjudicator": [0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0],
      "system-maximalist": [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 3, 1],
    };

    for (const [roleId, answers] of Object.entries(witnesses)) {
      expect(answers).toHaveLength(nbtiSeries.questions.length);
      expect(buildReportViewModel(nbtiSeries, answers).role.id).toBe(roleId);
    }

    expect(new Set(Object.keys(witnesses))).toEqual(
      new Set(reportRoleIds.filter((roleId) => roleId !== "multi-path")),
    );
  });

  it("only points at files for the six generated roles", () => {
    const rolesWithAssets = reportRoleIds.filter(
      (roleId) => Boolean(reportRoleMap[roleId].assetSrc),
    );

    expect(rolesWithAssets).toEqual([
      "watchdog",
      "stress-tester",
      "cyber-adjudicator",
      "iteration-engine",
      "fixed-bearing",
      "signal-clarifier",
    ]);
  });
});
