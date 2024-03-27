import { createSlice } from '@reduxjs/toolkit';
import * as actions from './ProductsApi';

export const productState = createSlice({
    name: 'products',
    initialState: {
        products: null,
        product: null,
        searchValue: null,
        valueCategory: null,
        filterProductValue: null,
        isLoading: true,
    },
    reducers: {
        getProduct: (state, action) => {
            state.product = action.payload.product;
        },
        filterProducts: (state, action) => {
            state.filterProductValue = action.payload.filterProductValue;
        },
        searchProducts: (state, action) => {
            state.searchValue = action.payload.searchValue;
        },
        directCategory: (state, action) => {
            state.valueCategory = action.payload.valueCategory;
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

export const { getProduct, searchProducts, directCategory, filterProducts } = productState.actions;
export default productState.reducer;
