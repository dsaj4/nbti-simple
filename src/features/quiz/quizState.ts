import { useCallback, useEffect, useReducer } from "react";

export type QuizState = {
  answers: (number | null)[];
  currentIndex: number;
};

export type QuizAction =
  | { type: "select"; questionIndex: number; optionIndex: number }
  | { type: "go"; questionIndex: number }
  | { type: "next" }
  | { type: "previous" }
  | { type: "reset" }
  | { type: "restore"; answers: (number | null)[]; currentIndex: number };

export function createInitialQuizState(questionCount: number): QuizState {
  return {
    answers: Array.from({ length: questionCount }, () => null),
    currentIndex: 0,
  };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "select": {
      const answers = state.answers.slice();
      answers[action.questionIndex] = action.optionIndex;
      return { ...state, answers };
    }
    case "go":
      return { ...state, currentIndex: action.questionIndex };
    case "next":
      return {
        ...state,
        currentIndex: Math.min(state.answers.length - 1, state.currentIndex + 1),
      };
    case "previous":
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - 1),
      };
    case "reset":
      return createInitialQuizState(state.answers.length);
    case "restore":
      return {
        answers: action.answers.slice(),
        currentIndex: action.currentIndex,
      };
    default:
      return state;
  }
}

const STORAGE_KEY = "nbti-quiz-draft";
let memoryDraft: StoredDraft | null = null;

type StoredDraft = {
  answers: (number | null)[];
  currentIndex: number;
  savedAt: number;
};

export function saveQuizDraft(state: QuizState): boolean {
  const draft: StoredDraft = {
    answers: state.answers.slice(),
    currentIndex: state.currentIndex,
    savedAt: Date.now(),
  };
  memoryDraft = draft;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function loadQuizDraft(questionCount: number): QuizState | null {
  let draft: StoredDraft | null = memoryDraft;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      draft = JSON.parse(raw) as StoredDraft;
    }
  } catch {
    // Fall back to the latest in-memory draft.
  }

  if (
    !draft ||
    !Array.isArray(draft.answers) ||
    draft.answers.length !== questionCount
  ) {
    return null;
  }

  return {
    answers: draft.answers.slice(),
    currentIndex: Math.max(
      0,
      Math.min(questionCount - 1, draft.currentIndex ?? 0),
    ),
  };
}

export function clearQuizDraft(): void {
  memoryDraft = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function useQuizState(questionCount: number) {
  const [state, dispatch] = useReducer(
    quizReducer,
    questionCount,
    (count) => loadQuizDraft(count) ?? createInitialQuizState(count),
  );

  const selectOption = useCallback(
    (questionIndex: number, optionIndex: number) => {
      dispatch({ type: "select", questionIndex, optionIndex });
    },
    [],
  );

  const goToQuestion = useCallback((questionIndex: number) => {
    dispatch({ type: "go", questionIndex });
  }, []);

  const goNext = useCallback(() => {
    dispatch({ type: "next" });
  }, []);

  const goPrevious = useCallback(() => {
    dispatch({ type: "previous" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    clearQuizDraft();
  }, []);

  const restore = useCallback((draft: QuizState) => {
    dispatch({ type: "restore", answers: draft.answers, currentIndex: draft.currentIndex });
  }, []);

  // Persist to sessionStorage on every change.
  useEffect(() => {
    saveQuizDraft(state);
  }, [state]);

  return {
    state,
    selectOption,
    goToQuestion,
    goNext,
    goPrevious,
    reset,
    restore,
  };
}
