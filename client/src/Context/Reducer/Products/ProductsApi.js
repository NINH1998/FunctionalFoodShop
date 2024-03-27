import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from 'Context/StoreApi';

export const getProducts = createAsyncThunk('getProducts', async (data, { rejectWithValue }) => {
    const response = await api.apiGetProducts(data);
    if (!response.success) return rejectWithValue(response);
    return response;
});
