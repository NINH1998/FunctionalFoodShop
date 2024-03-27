import { createSlice } from '@reduxjs/toolkit';
import * as actions from './ApiLoginGoogle';

export const googleLogin = createSlice({
    name: 'GoogleLogin',
    initialState: {
        tokenGoogle: null,
        isGoogleLogin: false,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(actions.googleLogin.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.googleLogin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.token = action.payload.tokenGoogle;
            state.isGoogleLogin = true;
        });

        builder.addCase(actions.googleLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.isGoogleLogin = false;
        });
    },
});

export default googleLogin.reducer;
