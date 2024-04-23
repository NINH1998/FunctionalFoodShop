import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from 'Context/StoreApi';

export const getTag = createAsyncThunk('getTag', async (data, { rejectWithValue }) => {
    const response = await api.apiGetTag(data);
    if (!response.success) return rejectWithValue(response);
    return response;
});
