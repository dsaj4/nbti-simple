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
    expect(screen.getByRole("radiogroup", { name: "选项" })).toBeVisible();
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

    expect(screen.getByRole("heading", { name: /拆题者|连线者|校准者|读场者|定锚者|探路者|望塔者|在场者|多路者/ })).toBeVisible();
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
        answers: [0, 1, null, null, null, null, null, null, null, null, null, null],
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
    expect(screen.getByRole("radiogroup", { name: "选项" })).toBeVisible();
  });

  it("renders a valid shared report on the first committed view", () => {
    window.location.hash = `#${encodeResult(
      nbtiSeries.id,
      nbtiSeries.version,
      Array(12).fill(0),
    )}`;
    render(<App />);

    expect(screen.getByRole("heading", { name: "拆题者" })).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: /在复杂现场里/ }),
    ).not.toBeInTheDocument();
  });

  afterEach(() => {
    window.location.hash = "";
  });
});

describe("ReportPage", () => {
  const report = buildReportViewModel(nbtiSeries, Array(12).fill(0));

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
      screen.getByRole("heading", { name: report.identity.label }),
    ).toBeVisible();
    expect(screen.getByText(report.safetyNote)).toBeVisible();
    expect(screen.getAllByText(report.dimensions[0].label)[0]).toBeVisible();
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
