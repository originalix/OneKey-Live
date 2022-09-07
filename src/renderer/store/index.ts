import { configureStore } from '@reduxjs/toolkit';
import runtime from './reducers/runtime';

export const store = configureStore({
  reducer: {
    runtime,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
