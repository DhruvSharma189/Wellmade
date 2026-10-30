import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FeedbackEntry } from './feedbackTypes';

const STORAGE_KEY = 'wellmade-feedback-v1';

function readFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FeedbackEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.email === 'string' &&
        typeof item.message === 'string' &&
        typeof item.createdAt === 'string',
    );
  } catch {
    return [];
  }
}

interface FeedbackState {
  entries: FeedbackEntry[];
  status: 'idle' | 'submitting' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FeedbackState = {
  entries: typeof localStorage === 'undefined' ? [] : readFeedback(),
  status: 'idle',
  error: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback(state, action: PayloadAction<FeedbackEntry>) {
      state.entries.unshift(action.payload);
      state.status = 'succeeded';
      state.error = null;
    },
    setSubmitting(state) {
      state.status = 'submitting';
      state.error = null;
    },
    resetFeedbackStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { addFeedback, setSubmitting, resetFeedbackStatus } = feedbackSlice.actions;
export { STORAGE_KEY as FEEDBACK_STORAGE_KEY };
export default feedbackSlice.reducer;
