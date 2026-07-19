import { Sparkle } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildReportViewModel } from "../domain/report";
import { nbtiSeries } from "../content/series";
import {
  clearQuizDraft,
  useQuizState,
} from "../features/quiz/quizState";
import {
  clearReportHash,
  decodeResult,
  encodeResult,
  readReportHash,
  writeReportHash,
} from "../features/share/codec";
import { HomePage } from "../ui/home/HomePage";
import { QuizPage } from "../ui/quiz/QuizPage";
import { ReportPage } from "../ui/report/ReportPage";

type AppPhase =
  | { phase: "home" }
  | { phase: "quiz" }
  | { phase: "report"; answers: number[] }
  | { phase: "invalid-link"; reason: string };

function getInitialAppPhase(): AppPhase {
  const hash = readReportHash();
  if (!hash) {
    return { phase: "home" };
  }

  const result = decodeResult(hash, nbtiSeries.questions.length);
  if (!result.ok) {
    return { phase: "invalid-link", reason: result.reason };
  }

  if (
    result.value.seriesId !== nbtiSeries.id ||
    result.value.version !== nbtiSeries.version
  ) {
    return {
      phase: "invalid-link",
      reason: "分享链接对应的测试版本已更新，无法重建旧结果。",
    };
  }

  return { phase: "report", answers: result.value.answers };
}

export function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>(getInitialAppPhase);

  useEffect(() => {
    const syncPhaseFromLocation = () => {
      setAppPhase(getInitialAppPhase());
    };

    window.addEventListener("hashchange", syncPhaseFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncPhaseFromLocation);
    };
  }, []);

  const {
    state: quizState,
    selectOption,
    goNext,
    goPrevious,
    goToQuestion,
    reset: resetQuiz,
  } = useQuizState(nbtiSeries.questions.length);

  const hasDraft = quizState.answers.some((a) => a !== null);

  const startQuiz = useCallback(() => {
    resetQuiz();
    clearReportHash();
    setAppPhase({ phase: "quiz" });
  }, [resetQuiz]);

  const resumeQuiz = useCallback(() => {
    setAppPhase({ phase: "quiz" });
  }, []);

  const restartQuiz = useCallback(() => {
    resetQuiz();
    setAppPhase({ phase: "quiz" });
  }, [resetQuiz]);

  const goHome = useCallback(() => {
    const hasProgress = quizState.answers.some((a) => a !== null);
    if (hasProgress) {
      const leave = window.confirm(
        "已答进度会保留在当前标签页，你可以稍后继续。确定现在返回首页吗？",
      );
      if (!leave) {
        return;
      }
    }
    setAppPhase({ phase: "home" });
    clearReportHash();
  }, [quizState]);

  const handleNext = useCallback(() => {
    if (quizState.currentIndex === nbtiSeries.questions.length - 1) {
      const answers = quizState.answers.map((a) => a ?? 0);
      const hash = encodeResult(nbtiSeries.id, nbtiSeries.version, answers);
      writeReportHash(hash);
      clearQuizDraft();
      setAppPhase({ phase: "report", answers });
    } else {
      goNext();
    }
  }, [quizState, goNext]);

  const handleRetake = useCallback(() => {
    resetQuiz();
    clearReportHash();
    setAppPhase({ phase: "quiz" });
  }, [resetQuiz]);

  const report = useMemo(() => {
    if (appPhase.phase !== "report") return null;
    return buildReportViewModel(nbtiSeries, appPhase.answers);
  }, [appPhase]);

  const shareUrl = useMemo(() => {
    if (appPhase.phase !== "report") return undefined;
    const encoded = encodeResult(
      nbtiSeries.id,
      nbtiSeries.version,
      appPhase.answers,
    );
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  }, [appPhase]);

  if (appPhase.phase === "home") {
    return (
      <div className="page">
        <HomePage
          onStart={startQuiz}
          onResume={hasDraft ? resumeQuiz : undefined}
          onRestart={hasDraft ? restartQuiz : undefined}
          hasDraft={hasDraft}
        />
      </div>
    );
  }

  if (appPhase.phase === "quiz") {
    const question = nbtiSeries.questions[quizState.currentIndex];
    return (
      <div className="page">
        <QuizPage
          question={question}
          questionIndex={quizState.currentIndex}
          totalQuestions={nbtiSeries.questions.length}
          selectedOption={quizState.answers[quizState.currentIndex] ?? null}
          onSelect={(optionIndex) =>
            selectOption(quizState.currentIndex, optionIndex)
          }
          onPrevious={() => {
            if (quizState.currentIndex === 0) {
              goHome();
            } else {
              goPrevious();
            }
          }}
          onNext={handleNext}
          onHome={goHome}
          isLast={quizState.currentIndex === nbtiSeries.questions.length - 1}
        />
      </div>
    );
  }

  if (appPhase.phase === "report" && report) {
    return (
      <div className="page">
        <ReportPage
          report={report}
          shareUrl={shareUrl}
          onRetake={handleRetake}
        />
      </div>
    );
  }

  if (appPhase.phase === "invalid-link") {
    return (
      <div className="page">
        <main className="invalid-link">
          <header className="invalid-link__header">
            <span className="brand-mark">
              <Sparkle weight="fill" aria-hidden="true" />
              NBTI
            </span>
          </header>
          <div className="invalid-link__card">
            <h1>链接无法打开</h1>
            <p>{appPhase.reason}</p>
            <button
              type="button"
              className="button button--primary"
              onClick={startQuiz}
            >
              开始新的测试
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
