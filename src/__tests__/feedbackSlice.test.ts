import { describe, expect, it } from 'vitest';
import feedbackReducer, {
  addFeedback,
  resetFeedbackStatus,
  setSubmitting,
} from '../features/feedback/feedbackSlice';
import type { FeedbackEntry } from '../features/feedback/feedbackTypes';

describe('feedbackSlice reducer', () => {
  const initial = {
    entries: [],
    status: 'idle' as const,
    error: null,
  };

  it('handles addFeedback correctly', () => {
    const entry: FeedbackEntry = {
      id: 'test-1',
      name: 'Alex Rivera',
      email: 'alex@example.com',
      message: 'Love the 3D showcase!',
      createdAt: '2026-10-29T10:00:00.000Z',
    };

    const nextState = feedbackReducer(initial, addFeedback(entry));
    expect(nextState.entries).toHaveLength(1);
    expect(nextState.entries[0]).toEqual(entry);
    expect(nextState.status).toBe('succeeded');
  });

  it('handles setSubmitting and resetFeedbackStatus', () => {
    let state = feedbackReducer(initial, setSubmitting());
    expect(state.status).toBe('submitting');

    state = feedbackReducer(state, resetFeedbackStatus());
    expect(state.status).toBe('idle');
  });
});
