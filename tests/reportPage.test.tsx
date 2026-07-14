import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReportViewModel } from "../contracts/report-view-model";
import { reportData } from "../src/features/report/reportData";
import { ReportPage } from "../src/ui/report/ReportPage";

describe("report page", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
  });

  it("renders the structured identity, scores, and safety note", () => {
    render(<ReportPage report={reportData} />);

    expect(screen.getByRole("heading", { name: "赛博判官" })).toBeVisible();
    expect(screen.getByText("Cyber Judge")).toBeVisible();
    const capabilitySummary = screen.getByRole("complementary", {
      name: "类型能力摘要",
    });
    expect(within(capabilitySummary).getByText("衡量人文")).toBeVisible();
    expect(
      within(capabilitySummary).getByText("会把抽象标准放回具体人的处境。"),
    ).toBeVisible();
    expect(screen.getByRole("meter", { name: "解构 88 分" })).toHaveAttribute(
      "aria-valuenow",
      "88",
    );
    expect(screen.getByText(reportData.safetyNote)).toBeVisible();
  });

  it("switches the stage with its tab controls", () => {
    render(<ReportPage report={reportData} />);

    const selfTab = screen.getByRole("tab", { name: /本尊幕/ });
    const questionTab = screen.getByRole("tab", { name: /追问幕/ });
    expect(selfTab).toHaveAttribute("aria-selected", "true");

    fireEvent.click(questionTab);

    expect(questionTab).toHaveAttribute("aria-selected", "true");
    expect(selfTab).toHaveAccessibleName(/本尊本尊幕/);
    expect(questionTab).toHaveAccessibleName(/转场追问幕/);
    expect(
      screen.getByAltText("低多边形纸偶风的古典哲人，举起手指追问"),
    ).toHaveAttribute("src", "/assets/philosopher.webp");
  });

  it("switches and moves focus with the stage arrow keys", () => {
    render(<ReportPage report={reportData} />);

    const selfTab = screen.getByRole("tab", { name: /本尊幕/ });
    const questionTab = screen.getByRole("tab", { name: /追问幕/ });

    selfTab.focus();
    fireEvent.keyDown(selfTab, { key: "ArrowRight" });
    expect(questionTab).toHaveAttribute("aria-selected", "true");
    expect(questionTab).toHaveFocus();

    fireEvent.keyDown(questionTab, { key: "ArrowLeft" });
    expect(selfTab).toHaveAttribute("aria-selected", "true");
    expect(selfTab).toHaveFocus();
  });

  it("renders a report without result-specific ids or visual fallbacks", () => {
    const alternateReport: ReportViewModel = {
      ...reportData,
      identity: {
        ...reportData.identity,
        label: "边界织工",
        englishLabel: "Boundary Weaver",
      },
      stage: {
        ...reportData.stage,
        capabilityHighlights: [
          { dimensionId: "context", title: "识别语境" },
          { dimensionId: "craft", title: "编织边界" },
        ],
        cameoStates: [
          {
            id: "workshop",
            label: "工作幕",
            description: "把界面条件编织起来。",
          },
        ],
      },
      dimensions: [
        { id: "context", label: "语境", shortCode: "C", value: 82, explanation: "先识别条件。" },
        { id: "craft", label: "构造", shortCode: "W", value: 86, explanation: "再建立边界。" },
        { id: "tempo", label: "节奏", shortCode: "T", value: 77, explanation: "保持推进节奏。" },
        { id: "care", label: "关照", shortCode: "R", value: 80, explanation: "关照使用者。" },
      ],
    };

    render(<ReportPage report={alternateReport} />);

    expect(screen.getByText("Boundary Weaver")).toBeVisible();
    const capabilitySummary = screen.getByRole("complementary", {
      name: "类型能力摘要",
    });
    expect(within(capabilitySummary).getByText("识别语境")).toBeVisible();
    expect(within(capabilitySummary).getByText("先识别条件。")).toBeVisible();
    expect(screen.getByText("C")).toBeVisible();
    expect(screen.queryByAltText(/赛博判官|古典哲人/)).not.toBeInTheDocument();
  });

  it("copies the report link when native sharing is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ReportPage report={reportData} />);

    fireEvent.click(screen.getByRole("button", { name: "分享" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(window.location.href));
    expect(screen.getByRole("status")).toHaveTextContent("链接已复制");
  });

  it("uses selection copy when the Clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
    render(<ReportPage report={reportData} />);

    fireEvent.click(screen.getByRole("button", { name: "分享" }));

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith("copy"));
    expect(screen.getByRole("status")).toHaveTextContent("链接已复制");
  });

  it("reveals a selectable link when browser security blocks copying", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });
    render(<ReportPage report={reportData} />);

    fireEvent.click(screen.getByRole("button", { name: "分享" }));

    expect(await screen.findByRole("textbox", { name: "报告链接" })).toHaveValue(
      window.location.href,
    );
    expect(screen.getByRole("status")).toHaveTextContent("请复制下方链接");
  });

  it("falls back when native sharing is exposed but rejects", async () => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error("Not supported here")),
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: undefined,
    });
    render(<ReportPage report={reportData} />);

    fireEvent.click(screen.getByRole("button", { name: "分享" }));

    expect(await screen.findByRole("textbox", { name: "报告链接" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("请复制下方链接");
  });

  it("reveals a link when clipboard permission is denied", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: undefined,
    });
    render(<ReportPage report={reportData} />);

    fireEvent.click(screen.getByRole("button", { name: "分享" }));

    expect(await screen.findByRole("textbox", { name: "报告链接" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("请复制下方链接");
  });
});
