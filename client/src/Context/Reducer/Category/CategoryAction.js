import { createSlice } from '@reduxjs/toolkit';
import * as actions from './CategoryApi';

export const categories = createSlice({
    name: 'category',
    initialState: {
        categories: null,
        categoryItem: [],
        uploadCategory: false,
        isLoading: true,
    },
    reducers: {
        setSelectedListCategory: (state, action) => {
            state.categoryItem = action.payload;
        },
        setUploadCategory: (state, action) => {
            state.uploadCategory = action.payload.uploadCategory;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        });

        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});
export const { setSelectedListCategory, setUploadCategory } = categories.actions;

export default categories.reducer;
