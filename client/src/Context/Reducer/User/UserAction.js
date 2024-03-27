import { createSlice } from '@reduxjs/toolkit';
import * as actions from './UserApi';

export const userState = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        token: null,
        current: null,
        currentCart: [],
        isLoading: false,
        updateCurrent: false,
        mes: '',
    },
    reducers: {
        login: (state, action) => {
            const { isLoggedIn, token, current, currentCart } = action.payload;
            state.isLoggedIn = isLoggedIn;
            state.token = token;
            state.current = current;
            state.currentCart = currentCart;
        },
        logout: (state, action) => {
            const { isLoggedIn, token, current, currentCart } = action.payload;
            state.isLoggedIn = isLoggedIn;
            state.token = token;
            state.current = current;
            state.currentCart = currentCart;
        },

        updateCart: (state, action) => {
            const { pid, quantity } = action.payload;
            const updateItem = state.currentCart.find((el) => el.product._id === pid);
            if (updateItem) updateItem.quantity = quantity;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(actions.getCurrentUser.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
            state.isLoggedIn = true;
            state.currentCart = action.payload.cart;
        });

        builder.addCase(actions.getCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            localStorage.removeItem('user');
            state.mes = 'Hết phiên đăng nhập';
        });
    },
});
export const { login, logout, updateCart } = userState.actions;

export default userState.reducer;
