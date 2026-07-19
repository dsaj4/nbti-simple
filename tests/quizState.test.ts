import { describe, expect, it, vi } from "vitest";
import {
  clearQuizDraft,
  createInitialQuizState,
  loadQuizDraft,
  quizReducer,
  saveQuizDraft,
} from "../src/features/quiz/quizState";

describe("quiz state", () => {
  it("cannot advance past the last question", () => {
    const state = createInitialQuizState(12);
    const atEnd = quizReducer({ ...state, currentIndex: 11 }, { type: "next" });
    expect(atEnd.currentIndex).toBe(11);
  });

  it("preserves answers when navigating backward and forward", () => {
    let state = createInitialQuizState(12);
    state = quizReducer(state, { type: "select", questionIndex: 0, optionIndex: 2 });
    state = quizReducer(state, { type: "next" });
    state = quizReducer(state, { type: "select", questionIndex: 1, optionIndex: 1 });
    state = quizReducer(state, { type: "previous" });
    expect(state.currentIndex).toBe(0);
    expect(state.answers[0]).toBe(2);
    state = quizReducer(state, { type: "next" });
    expect(state.answers[1]).toBe(1);
  });

  it("saves and restores a draft from sessionStorage", () => {
    const state = createInitialQuizState(12);
    state.answers[0] = 1;
    state.answers[1] = 2;
    state.currentIndex = 1;
    expect(saveQuizDraft(state)).toBe(true);

    const restored = loadQuizDraft(12);
    expect(restored).toEqual({ answers: [1, 2, ...Array(10).fill(null)], currentIndex: 1 });

    clearQuizDraft();
    expect(loadQuizDraft(12)).toBeNull();
  });

  it("returns null when the draft question count does not match", () => {
    const state = createInitialQuizState(12);
    saveQuizDraft(state);
    expect(loadQuizDraft(10)).toBeNull();
    clearQuizDraft();
  });

  it("gracefully handles storage failure", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage disabled");
      });
    const state = createInitialQuizState(12);
    expect(saveQuizDraft(state)).toBe(false);
    setItemSpy.mockRestore();
  });

  it("restores from memory when sessionStorage is unavailable", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage disabled");
      });
    const state = createInitialQuizState(12);
    state.answers[0] = 3;
    state.currentIndex = 1;
    saveQuizDraft(state);
    setItemSpy.mockRestore();

    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("Storage disabled");
      });
    expect(loadQuizDraft(12)).toEqual({
      answers: [3, ...Array(11).fill(null)],
      currentIndex: 1,
    });
    getItemSpy.mockRestore();
    clearQuizDraft();
  });

  it("resets to the initial state", () => {
    let state = createInitialQuizState(12);
    state = quizReducer(state, { type: "select", questionIndex: 0, optionIndex: 1 });
    state = quizReducer(state, { type: "go", questionIndex: 5 });
    state = quizReducer(state, { type: "reset" });
    expect(state.answers).toEqual(Array(12).fill(null));
    expect(state.currentIndex).toBe(0);
  });
});
