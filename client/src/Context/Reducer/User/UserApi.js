import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from 'Context/StoreApi';

export const getCurrentUser = createAsyncThunk('getCurrentUser', async (data, { rejectWithValue }) => {
    const response = await api.apiGetCurrentUser();
    if (!response.success) return rejectWithValue(response);
    return response.user;
});
