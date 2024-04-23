import { createSlice } from '@reduxjs/toolkit';
import * as actions from './tagProductApi';

export const tagProductState = createSlice({
    name: 'getTag',
    initialState: {
        tags: null,
        isLoading: true,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(actions.getTag.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getTag.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tags = action.payload.tags;
        });

        builder.addCase(actions.getTag.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});

export default tagProductState.reducer;
