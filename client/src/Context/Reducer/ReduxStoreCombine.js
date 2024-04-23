import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import categories from './Category/CategoryAction';
import productState from './Products/ProductsAction';
import userState from './User/UserAction';
import appState from './AppState/CommonAction';
import googleLogin from './LoginGooole/LoginGoogleAction';
import tagProductState from './TagProduct/TagProductAction';

export const store = configureStore({
    reducer: {
        appReducer: appState,
        googleLoginReducer: googleLogin,
        categoriesReducer: categories,
        productsReducer: productState,
        tagReducer: tagProductState,
        userReducer: userState,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
