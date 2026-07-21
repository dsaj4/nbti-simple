import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";
import { nbtiSeries } from "../src/content/series";
import { buildReportViewModel } from "../src/domain/report";
import { clearQuizDraft } from "../src/features/quiz/quizState";
import { encodeResult } from "../src/features/share/codec";
import { ReportPage } from "../src/ui/report/ReportPage";

describe("App flow", () => {
  beforeEach(() => {
    clearQuizDraft();
    window.location.hash = "";
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
  });

  it("shows the home page and starts the quiz", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /在复杂现场里/ }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "开始测试" }));
    expect(
      screen.getByRole("radiogroup", {
        name: nbtiSeries.questions[0].prompt,
      }),
    ).toBeVisible();
  });

  it("prevents advancing without selecting an option", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "开始测试" }));
    const nextButton = screen.getByRole("button", { name: "下一题" });
    expect(nextButton).toBeDisabled();
  });

  it("completes the quiz and shows the report", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "开始测试" }));

    for (let index = 0; index < nbtiSeries.questions.length; index += 1) {
      const options = screen.getAllByRole("radio");
      fireEvent.click(options[0]);
      const nextButton = screen.getByRole("button", {
        name: index === nbtiSeries.questions.length - 1 ? "查看结果" : "下一题",
      });
      expect(nextButton).not.toBeDisabled();
      fireEvent.click(nextButton);
    }

    expect(screen.getByRole("heading", { name: /破壁人|看门狗|杠精|赛博判官|卷王|头铁|人间清醒|绝活哥|思想钢印|树人|赌神|扫地僧|多路者/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "重新测试" })).toBeVisible();
  });

  it("encodes the result in the URL fragment", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "开始测试" }));

    for (let index = 0; index < nbtiSeries.questions.length; index += 1) {
      fireEvent.click(screen.getAllByRole("radio")[0]);
      fireEvent.click(
        screen.getByRole("button", {
          name:
            index === nbtiSeries.questions.length - 1 ? "查看结果" : "下一题",
        }),
      );
    }

    expect(window.location.hash).toMatch(/^#report\//);
  });

  it("offers to resume an in-progress draft", async () => {
    sessionStorage.setItem(
      "nbti-quiz-draft",
      JSON.stringify({
        answers: [0, 1, ...Array(22).fill(null)],
        currentIndex: 2,
        savedAt: Date.now(),
      }),
    );
    render(<App />);
    const resumeButton = await screen.findByRole("button", {
      name: "继续测试",
    });
    expect(resumeButton).toBeVisible();
    expect(screen.getByRole("button", { name: "重新开始" })).toBeVisible();
    fireEvent.click(resumeButton);
    expect(screen.getByText(nbtiSeries.questions[2].prompt)).toBeVisible();
    sessionStorage.removeItem("nbti-quiz-draft");
  });

  it("shows an invalid link recovery state", () => {
    window.location.hash = "#report/nbti-mvp:1:zzzzzzzzzzzz";
    render(<App />);
    expect(screen.getByText(/链接无法打开/)).toBeVisible();
    expect(
      screen.getByRole("button", { name: "开始新的测试" }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "开始新的测试" }));
    expect(window.location.hash).toBe("");
    expect(
      screen.getByRole("radiogroup", {
        name: nbtiSeries.questions[0].prompt,
      }),
    ).toBeVisible();
  });

  it("renders a valid shared report on the first committed view", () => {
    window.location.hash = `#${encodeResult(
      nbtiSeries.id,
      nbtiSeries.version,
      Array(24).fill(0),
    )}`;
    render(<App />);

    const expectedRole = buildReportViewModel(
      nbtiSeries,
      Array(24).fill(0),
    ).role.label;
    expect(screen.getByRole("heading", { name: expectedRole })).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: /在复杂现场里/ }),
    ).not.toBeInTheDocument();
  });

  it("syncs the page when the result hash changes in the same tab", async () => {
    render(<App />);
    window.location.hash = `#${encodeResult(
      nbtiSeries.id,
      nbtiSeries.version,
      Array(24).fill(0),
    )}`;
    window.dispatchEvent(new Event("hashchange"));

    await waitFor(() => {
      const expectedRole = buildReportViewModel(
        nbtiSeries,
        Array(24).fill(0),
      ).role.label;
      expect(screen.getByRole("heading", { name: expectedRole })).toBeVisible();
    });
  });

  afterEach(() => {
    window.location.hash = "";
  });
});

describe("ReportPage", () => {
  const report = buildReportViewModel(nbtiSeries, Array(24).fill(0));

  beforeEach(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
  });

  it("renders identity, dimensions, and safety note", () => {
    render(<ReportPage report={report} onRetake={() => {}} />);
    expect(
      screen.getByRole("heading", { name: report.role.label }),
    ).toBeVisible();
    expect(screen.getByText(report.safetyNote)).toBeVisible();
    expect(screen.getByText(report.stage.scene)).toBeVisible();
    expect(screen.getAllByText(report.dimensions[0].label)[0]).toBeVisible();
    if (report.role.assetSrc) {
      expect(document.querySelector(`img[src="${report.role.assetSrc}"]`)).toBeInTheDocument();
    }
  });

  it("keeps an intentional empty figure when a role asset is not ready", () => {
    const withoutAsset = {
      ...report,
      role: {
        ...report.role,
        id: "wall-breaker",
        label: "破壁人",
        assetSrc: undefined,
      },
    };
    const { container } = render(
      <ReportPage report={withoutAsset} onRetake={() => {}} />,
    );

    expect(container.querySelector(".report-cover__figure--empty")).toBeInTheDocument();
    expect(container.querySelector(".report-cover__role-image")).not.toBeInTheDocument();
  });

  it("copies the report link when native sharing is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ReportPage report={report} onRetake={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "分享我的结果" }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByRole("status")).toHaveTextContent("链接已复制");
  });

  it("falls back to selection copy when the Clipboard API is unavailable", async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
    render(<ReportPage report={report} onRetake={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "分享我的结果" }));

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith("copy"));
    expect(screen.getByRole("status")).toHaveTextContent("链接已复制");
  });

  it("reveals a selectable link when copying is blocked", async () => {
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });
    render(<ReportPage report={report} onRetake={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "分享我的结果" }));

    expect(
      await screen.findByRole("textbox", { name: "报告链接" }),
    ).toBeVisible();
  });
});
