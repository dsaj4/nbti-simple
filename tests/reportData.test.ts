import { describe, expect, it } from "vitest";
import type { ReportViewModel } from "../contracts/report-view-model";
import {
  assertReportIsComplete,
  reportData,
} from "../src/features/report/reportData";

describe("report data boundary", () => {
  it("accepts the complete fixture", () => {
    expect(assertReportIsComplete(reportData)).toBe(reportData);
    expect(reportData.dimensions).toHaveLength(4);
    expect(reportData.safetyNote).toContain("不是心理诊断");
  });

  it("rejects a score outside the report scale", () => {
    const invalidReport: ReportViewModel = {
      ...reportData,
      dimensions: reportData.dimensions.map((dimension, index) =>
        index === 0 ? { ...dimension, value: 101 } : dimension,
      ),
    };

    expect(() => assertReportIsComplete(invalidReport)).toThrow("超出 0–100");
  });

  it("rejects a capability that references an unknown dimension", () => {
    const invalidReport: ReportViewModel = {
      ...reportData,
      stage: {
        ...reportData.stage,
        capabilityHighlights: [{ dimensionId: "missing", title: "未知能力" }],
      },
    };

    expect(() => assertReportIsComplete(invalidReport)).toThrow("引用了不存在的维度");
  });

  it("rejects incomplete visual metadata", () => {
    const invalidReport: ReportViewModel = {
      ...reportData,
      stage: {
        ...reportData.stage,
        cameoStates: [
          {
            id: "invalid",
            label: "无效幕",
            description: "视觉元数据不完整。",
            visual: {
              src: "/assets/invalid.png",
              alt: "",
              width: 0,
              height: 100,
            },
          },
        ],
      },
    };

    expect(() => assertReportIsComplete(invalidReport)).toThrow("视觉素材不完整");
  });
});
