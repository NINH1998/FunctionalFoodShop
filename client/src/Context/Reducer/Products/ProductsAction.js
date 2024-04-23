import { createSlice } from '@reduxjs/toolkit';
import * as actions from './ProductsApi';

export const productState = createSlice({
    name: 'products',
    initialState: {
        products: null,
        product: null,
        searchValue: null,
        valueCategory: null,
        valueMainCategory: [],
        tagId: null,
        clearParams: false,
        isLoading: true,
    },
    reducers: {
        getProduct: (state, action) => {
            state.product = action.payload.product;
        },

        directCategory: (state, action) => {
            state.valueCategory = action.payload.valueCategory;
            state.valueMainCategory = action.payload.valueMainCategory;
            state.tagId = action.payload.tagId;
            state.clearParams = action.payload.clearParams;
            state.searchValue = action.payload.searchValue;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(actions.getProducts.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
        });

        builder.addCase(actions.getProducts.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});

export const { getProduct, directCategory } = productState.actions;
export default productState.reducer;
