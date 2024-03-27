import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from 'Context/StoreApi';

export const googleLogin = createAsyncThunk('googleLogin', async (data, { rejectWithValue }) => {
    const response = await api.apiGoogleLogin();
    if (!response.success) return rejectWithValue(response);
    localStorage.setItem('user', JSON.stringify(response.token));
    return response;
});
