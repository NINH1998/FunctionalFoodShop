import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from 'Context/StoreApi';

export const getCategories = createAsyncThunk('getCategories', async (data, { rejectWithValue }) => {
    const response = await api.getProductCategory();
    if (!response.success) return rejectWithValue(response);
    return response.getCategory;
});
