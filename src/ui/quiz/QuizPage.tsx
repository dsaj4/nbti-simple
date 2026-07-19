import {
  CaretLeft,
  CaretRight,
  Check,
  Sparkle,
} from "@phosphor-icons/react";
import type { Question } from "../../../contracts/series-definition";

export type QuizPageProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onHome: () => void;
  isLast: boolean;
};

export function QuizPage({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelect,
  onPrevious,
  onNext,
  onHome,
  isLast,
}: QuizPageProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const canAdvance = selectedOption !== null;

  return (
    <main className="quiz-page">
      <header className="quiz-page__header">
        <button
          type="button"
          className="quiz-page__brand"
          onClick={onHome}
          aria-label="返回 NBTI 首页"
        >
          <Sparkle weight="fill" aria-hidden="true" />
          NBTI
        </button>
      </header>

      <div
        className="quiz-page__progress"
        role="progressbar"
        aria-label="答题进度"
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-valuenow={questionIndex + 1}
        aria-valuetext={`第 ${questionIndex + 1} 题，共 ${totalQuestions} 题`}
      >
        <div className="quiz-page__progress-text">
          <span className="quiz-page__progress-current">
            {String(questionIndex + 1).padStart(2, "0")}
          </span>
          <span className="quiz-page__progress-divider">/</span>
          <span>{String(totalQuestions).padStart(2, "0")}</span>
        </div>
        <div className="quiz-page__progress-track" aria-hidden="true">
          <div
            className="quiz-page__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <section className="quiz-page__card" aria-labelledby="quiz-tag">
        <div className="quiz-page__curtains" aria-hidden="true">
          <div className="quiz-page__curtain quiz-page__curtain--left" />
          <div className="quiz-page__curtain quiz-page__curtain--right" />
        </div>

        <div className="quiz-page__content">
          <span id="quiz-tag" className="quiz-page__tag">
            {question.tag}
          </span>

          <h1 className="quiz-page__prompt">{question.prompt}</h1>

          <div
            className="quiz-page__options"
            role="radiogroup"
            aria-label="选项"
          >
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={
                    selectedOption === null
                      ? index === 0
                        ? 0
                        : -1
                      : isSelected
                        ? 0
                        : -1
                  }
                  className={`quiz-page__option${
                    isSelected ? " quiz-page__option--selected" : ""
                  }`}
                  onClick={() => onSelect(index)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                      event.preventDefault();
                      const nextIndex =
                        (index + 1) % question.options.length;
                      onSelect(nextIndex);
                      setTimeout(() => {
                        document.getElementById(`${question.id}-option-${nextIndex}`)?.focus();
                      }, 0);
                    } else if (
                      event.key === "ArrowUp" ||
                      event.key === "ArrowLeft"
                    ) {
                      event.preventDefault();
                      const prevIndex =
                        (index - 1 + question.options.length) %
                        question.options.length;
                      onSelect(prevIndex);
                      setTimeout(() => {
                        document.getElementById(`${question.id}-option-${prevIndex}`)?.focus();
                      }, 0);
                    }
                  }}
                  id={`${question.id}-option-${index}`}
                >
                  <span className="quiz-page__option-marker" aria-hidden="true">
                    {isSelected ? (
                      <Check weight="bold" />
                    ) : (
                      <span className="quiz-page__option-dot" />
                    )}
                  </span>
                  <span className="quiz-page__option-label">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="quiz-page__nav">
        <button
          type="button"
          className="button button--secondary quiz-page__nav-btn"
          onClick={onPrevious}
          disabled={questionIndex === 0}
        >
          <CaretLeft weight="bold" aria-hidden="true" />
          上一题
        </button>

        <button
          type="button"
          className="button button--primary quiz-page__nav-btn"
          onClick={onNext}
          disabled={!canAdvance}
        >
          {isLast ? "查看结果" : "下一题"}
          {!isLast && <CaretRight weight="bold" aria-hidden="true" />}
        </button>
      </div>
    </main>
  );
}
