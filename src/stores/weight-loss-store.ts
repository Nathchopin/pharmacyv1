import { create } from 'zustand';

interface WeightLossState {
    step: number;
    answers: Record<string, any>;
    history: number[];
    direction: number;

    // Actions
    setAnswer: (key: string, value: any) => void;
    setStep: (step: number) => void;
    goNext: (nextStepIndex: number) => void;
    goBack: () => void;
    reset: () => void;
}

export const useWeightLossStore = create<WeightLossState>((set) => ({
    step: 0,
    answers: {},
    history: [],
    direction: 0,

    setAnswer: (key, value) =>
        set((state) => ({
            answers: { ...state.answers, [key]: value }
        })),

    setStep: (step) =>
        set((state) => ({
            step,
            direction: step > state.step ? 1 : -1
        })),

    goNext: (nextStepIndex) =>
        set((state) => ({
            history: [...state.history, state.step],
            step: nextStepIndex,
            direction: 1
        })),

    goBack: () =>
        set((state) => {
            if (state.history.length === 0) return state;
            const newHistory = [...state.history];
            const prevStep = newHistory.pop();
            return {
                history: newHistory,
                step: prevStep ?? 0,
                direction: -1
            };
        }),

    reset: () =>
        set({ step: 0, answers: {}, history: [], direction: 0 })
}));
