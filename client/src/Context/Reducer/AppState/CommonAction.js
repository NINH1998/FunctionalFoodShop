import { createSlice } from '@reduxjs/toolkit';

let storage = sessionStorage.getItem('cart');
if (storage) storage = JSON.parse(storage);
else storage = [];

export const appState = createSlice({
    name: 'app',
    initialState: {
        isShowModal: false,
        isModalChild: null,
        isOpenLoginModal: false,
        isOpenForgotPasswordModal: false,
        isOtpModal: false,
        isCartButtonModal: true,
        cartSession: storage,
        invalidField: [],
    },
    reducers: {
        setInvalidField: (state, action) => {
            if (action.payload === '') {
                state.invalidField = [];
            } else state.invalidField = [...state.invalidField, action.payload];
        },
        showModal: (state, action) => {
            state.isShowModal = action.payload.isShowModal;
            state.isModalChild = action.payload.isModalChild;
        },
        showLoginModal: (state, action) => {
            state.isOpenLoginModal = action.payload.isOpenLoginModal;
        },
        showForgotPasswordModal: (state, action) => {
            state.isOpenForgotPasswordModal = action.payload.isOpenForgotPasswordModal;
        },
        showAuthOtpModal: (state, action) => {
            state.isOtpModal = action.payload.isOtpModal;
        },
        showCartButtonModal: (state, action) => {
            state.isCartButtonModal = action.payload.isCartButtonModal;
        },
        updateCartQuantity: (state, action) => {
            let storage = sessionStorage.getItem('cart');
            if (storage) storage = JSON.parse(storage);
            else storage = [];

            const updatedCart = storage.map((item) =>
                item.product.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
            );
            sessionStorage.setItem('cart', JSON.stringify(updatedCart));
            state.cartSession = updatedCart;
        },
        addToCartSession: (state, action) => {
            let storage = sessionStorage.getItem('cart');
            if (storage) storage = JSON.parse(storage);
            else storage = [];

            const existingItem = storage.find((item) => item.product.id === action.payload.product.id);
            if (existingItem) {
                const updatedCart = storage.map((item) =>
                    item.product.id === action.payload.product.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item,
                );
                sessionStorage.setItem('cart', JSON.stringify(updatedCart));
                state.cartSession = updatedCart;
            } else {
                const updatedCart = [...state.cartSession, { ...action.payload, quantity: action.payload.quantity }];
                sessionStorage.setItem('cart', JSON.stringify(updatedCart));
                state.cartSession = updatedCart;
            }
        },
        removeSessionCartItems: (state, action) => {
            let storage = sessionStorage.getItem('cart');
            if (storage) storage = JSON.parse(storage);
            else storage = [];
            const updatedCartRemove = storage.filter((item) => item.product.id !== action.payload.id);
            sessionStorage.setItem('cart', JSON.stringify(updatedCartRemove));
            state.cartSession = updatedCartRemove;
        },
    },
});

export const {
    showModal,
    addToCartSession,
    removeSessionCartItems,
    showCartButtonModal,
    updateCartQuantity,
    setInvalidField,
    showLoginModal,
    showForgotPasswordModal,
    showAuthOtpModal,
} = appState.actions;
export default appState.reducer;
