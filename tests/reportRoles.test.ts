import { describe, expect, it } from "vitest";
import type { DimensionKey } from "../contracts/score-result";
import { identityMap } from "../src/content/identities";
import { reportRoleForIdentity, reportRoleIds, reportRoleMap } from "../src/content/reportRoles";

const zeroPositions = (): Record<DimensionKey, number> => ({ cognitivePath: 0, driveSource: 0, cognitiveTempo: 0, valueOrientation: 0 });

describe("report roles", () => {
  it("maps every canonical type directly to its report role", () => {
    for (const id of Object.keys(identityMap)) {
      expect(reportRoleForIdentity(id, zeroPositions()).id).toBe(id);
    }
  });

  it("keeps assets for all twelve canonical roles", () => {
    const canonical = reportRoleIds.filter((id) => id !== "multi-path");
    expect(canonical).toEqual(Object.keys(identityMap));
    expect(canonical.every((id) => Boolean(reportRoleMap[id].assetSrc))).toBe(true);
  });
});
