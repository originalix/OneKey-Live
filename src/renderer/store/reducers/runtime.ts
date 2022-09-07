import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KnownDevice } from '@onekeyfe/hd-core';

type InitialState = {
  device: KnownDevice | null;
};

const initialState: InitialState = {
  device: null,
};

export const runtimeSlice = createSlice({
  name: 'runtime',
  initialState,
  reducers: {
    setDevice(state, action: PayloadAction<InitialState['device']>) {
      state.device = action.payload;
    },
  },
});

export const { setDevice } = runtimeSlice.actions;

export default runtimeSlice.reducer;
