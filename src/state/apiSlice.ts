import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { RootState, AppThunk } from './store';

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

const initialState: ApiState<any> = {
    data: null,
    loading: false,
    error: null,
};

const callApi = async <T>(
    url: string,
    method: string,
    payload?: any
): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axios.request({
            url,
            method,
            data: payload,
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError).response?.data || error;
    }
};

export const getData = createAsyncThunk(
    'api/getData',
    async (url: string) => {
        return callApi(url, 'GET');
    }
);

export const postData = createAsyncThunk(
    'api/postData',
    async <T>(params: { url: string; payload: T }) => {
        return callApi(params.url, 'POST', params.payload);
    }
);

export const updateData = createAsyncThunk(
    'api/updateData',
    async <T>(params: { url: string; payload: T }) => {
        return callApi(params.url, 'PUT', params.payload);
    }
);

export const deleteData = createAsyncThunk(
    'api/deleteData',
    async (url: string) => {
        return callApi(url, 'DELETE');
    }
);

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.data = null;
            })
            .addCase(postData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postData.fulfilled, (state,action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(postData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.data = null;
            })
            .addCase(updateData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default apiSlice.reducer;
